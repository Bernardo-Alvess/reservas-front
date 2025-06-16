export interface AddressDto {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface WorkHoursDto {
  day: string;
  open: string;
  close: string;
}

export interface GalleryImageDto {
  url: string;
}

export interface CreateRestaurantDto {
  name: string;
  phone: string;
  address: AddressDto;
  description: string;
  type: string;
  maxClients: number;
  workHours: WorkHoursDto[];
  maxReservationTime?: number;
  image?: string;
  menu?: string;
  gallery?: GalleryImageDto[];
  profileImage?: string;
  menuPdf?: string;
} 
