export interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo?: Geo
}

export interface Geo {
  lat: string
  lng: string
}
