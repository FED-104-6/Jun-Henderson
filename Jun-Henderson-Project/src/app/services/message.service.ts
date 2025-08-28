import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, orderBy, query, serverTimestamp, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { FlatMessage } from '../models/message.entity';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private db = inject(Firestore);
  private auth = inject(Auth);

  listForOwner(flatId: string, ownerId: string): Observable<FlatMessage[]> {
    const ref = collection(this.db, 'messages');
    const q = query(ref, where('flatId', '==', flatId), where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<FlatMessage[]>;
  }

  listForSender(flatId: string, senderId: string): Observable<FlatMessage[]> {
    const ref = collection(this.db, 'messages');
    const q = query(ref, where('flatId', '==', flatId), where('senderId', '==', senderId), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<FlatMessage[]>;
  }

  async send(params: { flatId: string; ownerId: string; content: string; senderName: string; senderEmail: string; senderId: string; }) {
    const ref = collection(this.db, 'messages');
    await addDoc(ref, {
      flatId: params.flatId,
      ownerId: params.ownerId,
      senderId: params.senderId,
      senderName: params.senderName,
      senderEmail: params.senderEmail,
      content: params.content,
      createdAt: serverTimestamp(),
    });
  }
}
