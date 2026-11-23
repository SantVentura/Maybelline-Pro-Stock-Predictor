import additionalProducts from "./extraProducts";
const images = import.meta.glob('../assets/img/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

const getImage = (filename) => {
  const path = `../assets/img/${filename}`;
  const image = images[path];

  if (!image) {
    console.warn(`No se encontró la imagen: ${path}`);
    return '';
  }

  return image;
};

const products = [
  {
    id: 1,
    description: "Base de maquillaje Fit Me Matte + Poreless de Maybelline. Elige el tono que utilizas en tu kit y controla sus unidades para anticipar tu reposición.",
    brand: "Maybelline",
    name: "Fit Me Matte + Poreless",
    category: "Rostro",
    rating: 4.8,
    price: 45900,
    oldPrice: 52900,
    shades: [
      {
        id: "120",
        name: "Classic Ivory",
        color: "#F1D2B5",
        image: getImage("ClassicIvory.jpeg"),
      },
      {
        id: "125",
        name: "Nude Beige",
        color: "#D9A783",
        image: getImage("NudeBeiget.jpeg"),
      },
      {
        id: "128",
        name: "Warm Nude",
        color: "#B97958",
        image: getImage("WarmNude.jpeg"),
      },
    ],
  },
  {
    id: 2,
    description: "Bálsamo labial Lifter Glaze de Maybelline. Explora los tonos disponibles en esta selección y mantén registrada tu variante favorita.",
    brand: "Maybelline",
    name: "Lifter Glaze Bálsamo Labial",
    category: "Labios",
    rating: 4.9,
    price: 139900,
    oldPrice: 154900,
    shades: [
      {
        id: "Pink Drip",
        name: "Pink Drip",
        color: "#ff9aa1",
        image: getImage("LifterGlazeBalsamoLabialPinkDrip.jpg"),
      },
      {
        id: "Cherry Swirl",
        name: "Cherry Swirl",
        color: "#cd0021",
        image: getImage("LifterGlazeBalsamoLabialCherrySwirl.jpg"),
      },
      {
        id: "Clear Crave",
        name: "Clear Crave",
        color: "#ffffff",
        image: getImage("LifterGlazeBalsamoLabialClearCrave.jpg"),
      },
    ],
  },
  {
    id: 3,
    description: "Rubor Fit Me de Maybelline para completar tu selección de rostro. Escoge el tono que prefieras y agrégalo a tu compra.",
    brand: "Maybelline",
    name: "FIT ME® RUBOR",
    category: "Rostro",
    rating: 4.7,
    price: 119900,
    oldPrice: 134900,
    shades: [
      {
        id: "Nude",
        name: "Nude",
        color: "#c87e6e",
        image: getImage("Rubor15-nude.jpg"),
      },
      {
        id: "Rose",
        name: "Rose",
        color: "#e68777",
        image: getImage("Rubor30-rose.jpg"),
      },
      {
        id: "peach",
        name: "Peach",
        color: "#ee906c",
        image: getImage("Rubor40-peach.jpg"),
      },
    ],
  },
  {
    id: 4,
    description: "Lápiz para cejas Tattoo Brow de Maybelline. Organiza tus tonos de cejas de manera independiente y repón el que se esté terminando.",
    brand: "Maybelline",
    name: "Tattoo Brow Pencil",
    category: "Ojos",
    rating: 4.8,
    price: 52900,
    oldPrice: 59900,
    shades: [
      {
        id: "Dark",
        name: "Dark",
        color: "#5c4130",
        image: getImage("Tattoo-brow-pencil-dark.jpg"),
      },
      {
        id: "Natural",
        name: "Natural",
        color: "#5d3929",
        image: getImage("Tattoo-brow-pencil-natural.jpg"),
      },
      {
        id: "Light",
        name: "Light",
        color: "#976952",
        image: getImage("Tattoo-brow-pencil-light.jpg"),
      },
    ],
  },
  {
    id: 5,
    description: "Base Super Stay Active Wear de Maybelline. Consulta las opciones de tono de este catálogo y elige la que corresponde a tu kit.",
    brand: "Maybelline",
    name: "BASE DE MAQUILLAJE SUPER STAY ACTIVE WEAR",
    category: "Rostro",
    rating: 4.8,
    price: 169900,
    oldPrice: 189900,
    shades: [
      {
        id: "Buff Beige",
        name: "Buff Beige",
        color: "#eeb18a",
        image: getImage("SuperStayBuffBeige.png"),
      },
      {
        id: "Porcelain",
        name: "Porcelain",
        color: "#ffecd9",
        image: getImage("SuperStayPorcelain.png"),
      },
      {
        id: "Warm Nude",
        name: "Warm Nude",
        color: "#eac0ac",
        image: getImage("SuperStayWarmnude.png"),
      },
    ],
  },
  {
    id: 6,
    description: "Delineador Tattoo Liner Play de Maybelline. Selecciona la variante deseada y lleva el control de su disponibilidad en tu inventario.",
    brand: "Maybelline",
    name: "TATTOO LINER PLAY",
    category: "Ojos",
    rating: 4.9,
    price: 149900,
    oldPrice: 164900,
    shades: [
      {
        id: "Defend",
        name: "Defend",
        color: "#ffff",
        image: getImage("TattooLinerPlayDefend.jpg"),
      },
      {
        id: "Drop",
        name: "Drop",
        color: "#eeaf46",
        image: getImage("TattooLinerPlayDrop.jpg"),
      },
      {
        id: "Ride",
        name: "Ride",
        color: "#67cecd",
        image: getImage("TattooLinerPlayRide.jpg"),
      },
    ],
  },
];

export default [...products, ...additionalProducts];
