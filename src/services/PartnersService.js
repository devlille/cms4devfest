import firebase from 'firebase/app';

class PartnersService {

  findAllForEdition(editionId) {
    return firebase.firestore()
    .collection('partners')
    .where('edition', '==', editionId)
    .get()
    .then(query => {
      const partners = {};
      query.forEach(doc => {
        const partnerData = doc.data();
        partnerData.activeOn = new Date(partnerData.activeOn.seconds * 1000);
        partners[doc.id] = partnerData;
      });

      return partners;
    });
  }

  findOne(partnerId) {
    return firebase.firestore()
    .collection('partners')
    .doc(partnerId)
    .get()
    .then(partner => {
      if (!partner.exists) {
        throw new Error(`Partner ${partnerId} doesn't exist !!`);
      }

      const partnerData = partner.data();
      partnerData.activeOn = new Date(partnerData.activeOn.seconds * 1000);
      return partnerData;
    });
  }

  create(partner) {
    const partnerToCreate = Object.assign({}, partner);
    partnerToCreate.createdBy = firebase.auth().currentUser.uid;
    partnerToCreate.createdAt = new Date();

    return firebase.firestore()
    .collection('partners')
    .add(partnerToCreate);
  }

  update(partnerId, partner) {
    const partnerToUpdate = Object.assign({}, partner);
    partnerToUpdate.modifiedBy = firebase.auth().currentUser.uid;
    partnerToUpdate.modifiedAt = new Date();

    return firebase.firestore()
    .collection('partners')
    .doc(partnerId)
    .set(partnerToUpdate);
  }

}

export default new PartnersService();
