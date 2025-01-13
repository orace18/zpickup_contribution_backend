// src/scripts/remove-notification-indexes.ts
import { MongoClient } from 'mongodb';

async function removeIndexes() {
  const uri =
    'mongodb+srv://zpickupbenin:vkbRRdlXU75t5SVi@cluster0.bk6kf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('notifications');

    // Récupérer tous les index
    const indexes = await collection.indexes();

    // Supprimer tous les index sauf _id
    for (const index of indexes) {
      if (index.name !== '_id_') {
        await collection.dropIndex(index.name);
        console.log(`Index ${index.name} supprimé avec succès`);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la suppression des index:', error);
  } finally {
    await client.close();
  }
}

removeIndexes();
