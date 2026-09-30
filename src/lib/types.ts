export type Department = "electrical" | "electronics" | "water-purifiers";

export interface Category {
  slug: string;
  name: string;
  department: Department;
  description?: string;
}

export interface Brand {
  slug: string;
  name: string;
}

export interface ProductAttribute {
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  priceDelta: number;
  stock: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  department: Department;
  category: string;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  mrp: number;
  price: number;
  gstRate: number;
  rating: number;
  reviewCount: number;
  stock: number;
  warrantyMonths: number;
  returnDays: number;
  isReturnable: boolean;
  tags: string[];
  attributes: ProductAttribute[];
  variants?: ProductVariant[];
  installation: "none" | "free" | "paid";
  installationFee: number;
  amcEligible: boolean;
  badges?: string[];
  whatsInTheBox: string[];
  reviews: Review[];
}

export interface AmcPlan {
  id: string;
  name: string;
  applicableCategories: Department[];
  durationMonths: number;
  visits: number;
  filtersIncluded: boolean;
  breakdownVisitsIncluded: boolean;
  price: number;
  highlight?: boolean;
  features: string[];
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  type: "home" | "work";
  isDefault: boolean;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  qty: number;
  addInstallation: boolean;
  addAmcPlanId?: string;
}

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "installed";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  variantLabel?: string;
  qty: number;
  price: number;
  addInstallation: boolean;
}

export interface Order {
  id: string;
  orderNo: string;
  createdAt: string;
  items: OrderItem[];
  addressId: string;
  addressSnapshot: Address;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  installationTotal: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  status: OrderStatus;
  couponCode?: string;
  gstin?: string;
}

export type ServiceType =
  | "installation"
  | "demo"
  | "filter-replacement"
  | "repair"
  | "amc-visit"
  | "uninstall-reinstall";

export type ServiceStatus =
  | "requested"
  | "assigned"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface ServiceRequest {
  id: string;
  jobNo: string;
  type: ServiceType;
  productName: string;
  issue: string;
  slotDate: string;
  slotTime: string;
  addressId: string;
  status: ServiceStatus;
  charges: number;
  createdAt: string;
  technicianName?: string;
}

export interface CustomerProduct {
  id: string;
  productId: string;
  name: string;
  serialNo?: string;
  purchaseDate: string;
  installDate?: string;
  warrantyEndDate: string;
  amcStatus: "none" | "active" | "expired";
  nextFilterChangeDate?: string;
}
