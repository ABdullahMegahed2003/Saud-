export type ProductStatus = "available" | "preorder";

export type ProductItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  image?: string;
};

export const products: ProductItem[] = [
  {
    id: 1,
    name: "قهوة سعودية فاخرة",
    description: "قهوة عربية أصلية بتحميصة متوازنة ونكهة غنية.",
    price: 145,
    status: "available",
  },
  {
    id: 2,
    name: "عسل سدر سعودي",
    description: "عسل سدر طبيعي بطعم أصيل وجودة مختارة بعناية.",
    price: 220,
    status: "preorder",
  },
  {
    id: 3,
    name: "تمر سكري فاخر",
    description: "تمور سكري طرية وحلوة، مناسبة للضيافة وكل يوم.",
    price: 95,
    status: "available",
  },
  {
    id: 4,
    name: "دهن عود سعودي",
    description: "رائحة عود دافئة وثابتة لمحبي العطور الشرقية.",
    price: 380,
    status: "preorder",
  },
  {
    id: 5,
    name: "بوكس الضيافة السعودية",
    description: "تشكيلة مرتبة من القهوة والتمر والعسل في بوكس واحد.",
    price: 310,
    status: "available",
  },
  {
    id: 6,
    name: "مبخرة بتصميم تراثي",
    description: "قطعة أنيقة تضيف لمسة سعودية أصيلة إلى بيتك.",
    price: 175,
    status: "preorder",
  },
  {
    id: 7,
    name: "زعفران سعودي فاخر",
    description: "خيوط زعفران مختارة بعناية تضيف نكهة ولونًا مميزين.",
    price: 260,
    status: "available",
  },
  {
    id: 8,
    name: "سمن بلدي سعودي",
    description: "سمن بلدي بنكهة غنية، مناسب للطبخ والحلويات الشرقية.",
    price: 195,
    status: "preorder",
  },
];
