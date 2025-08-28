import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { FlatMessage } from '../../models/message.entity';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-flat-messages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './flat-messages.html',
  styleUrls: ['./flat-messages.css'],
})
export class FlatMessagesComponent {
  private route = inject(ActivatedRoute);
  private db = inject(Firestore);
  private auth = inject(Auth);
  private fb = inject(FormBuilder);
  private msg = inject(MessageService);

  flatId = signal<string>('');
  ownerId = signal<string>('');
  userId = signal<string>('');
  userName = signal<string>('');
  userEmail = signal<string>('');
  isOwner = signal<boolean>(false);
  loading = signal<boolean>(true);
  sending = signal<boolean>(false);
  messages$: Observable<FlatMessage[]> = of([]);

  form = this.fb.group({
    content: ['', [Validators.required, Validators.minLength(2)]],
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.flatId.set(id);
    const snap = await getDoc(doc(this.db, 'flats', id));
    const data = snap.data() as any || {};
    this.ownerId.set(String(data.ownerId || ''));

    onAuthStateChanged(this.auth, u => {
      this.userId.set(u?.uid || '');
      this.userName.set(u?.displayName || '');
      this.userEmail.set(u?.email || '');
      this.isOwner.set(!!u && u.uid === this.ownerId());
      if (u) {
        this.messages$ = this.isOwner()
          ? this.msg.listForOwner(this.flatId(), this.ownerId())
          : this.msg.listForSender(this.flatId(), u.uid);
      } else {
        this.messages$ = of([]);
      }
      this.loading.set(false);
    });
  }

  async send() {
    if (this.sending() || this.isOwner() || this.form.invalid || !this.userId()) return;
    this.sending.set(true);
    try {
      await this.msg.send({
        flatId: this.flatId(),
        ownerId: this.ownerId(),
        content: String(this.form.value.content || '').trim(),
        senderName: this.userName() || this.userEmail() || 'Anonymous',
        senderEmail: this.userEmail() || '',
        senderId: this.userId(),
      });
      this.form.reset();
    } finally {
      this.sending.set(false);
    }
  }
}
