export class Martyr {
  contactInfo: string;
  name: string;
  surname: string;
  fathername: string;
  birthdate: string;
  fin: string;
  familyAddress: string;
  dateOfMartyrdomOrVeteran: string;
  regionId: number;
  identityPhotoId: string;
  children: Child[];
  rewards: Reward[];
  apartments: Apartment[]
}


class Child {
  name: string;
  surname: string;
  fin: string;
  birthdate: string;
  gender: number;
  identityPhotoId: string;
};

class Reward {
  name: string;
  date: string;
};

export class Apartment {
  peopleCount: number;
  totalArea: number;
  roomCount: number;
  hasDocument: boolean;
  photos: ApartmentPhoto[]
}

export class ApartmentPhoto {
  photoId: string;
}

