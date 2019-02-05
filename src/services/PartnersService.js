import firebase from 'firebase/app'

class PartnersService {

  findAllForEdition(editionId) {
    return firebase.firestore()
      .collection('partners')
      .where('edition', '==', editionId)
      .get()
      .then(query => {
        const partners = {};
        query.forEach(doc => partners[doc.id] = doc.data());
        return partners
      })
  }

  findOne(partnerId) {
    return firebase.firestore()
      .collection('partners')
      .doc(partnerId)
      .get()
      .then(partner => {
        if(!partner.exists) {
          throw new Error(`Partner ${partnerId} doesn't exist !!`)
        }

        return partner.data()
      })
  }

  uploadLogo(partner, logo) {
    const extension = logo.name.split('.').pop();

    const metadata = {};
    metadata.createdBy = firebase.auth().currentUser.uid;

    return firebase.storage().ref()
      .child(`editions/${partner.edition}/partners/${partner.name}.${extension}`)
      .put(logo, metadata);
  }

  create(partner) {
    const partnerToCreate = Object.assign({}, partner);
    partnerToCreate.createdBy = firebase.auth().currentUser.uid;
    partnerToCreate.createdAt = new Date().getTime();
    partnerToCreate.activeOn = partner.activeOn.getTime();

    return firebase.firestore()
      .collection('partners')
      .add(partnerToCreate)
  }

  update(partnerId, partner) {
    const partnerToUpdate = Object.assign({}, partner);
    partnerToUpdate.modifiedBy = firebase.auth().currentUser.uid;
    partnerToUpdate.modifiedAt = new Date().getTime();
    partnerToUpdate.activeOn = partner.activeOn.getTime();

    return firebase.firestore()
      .collection('partners')
      .doc(partnerId)
      .set(partnerToUpdate)
  }

}

export default new PartnersService()
