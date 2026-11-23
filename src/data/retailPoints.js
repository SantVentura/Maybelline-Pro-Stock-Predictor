// Direcciones de sucursales Éxito: https://www.exito.com/almacenes-exito
// Estos son comercios que venden Maybelline, NO tiendas propias de Maybelline.
// No se garantiza el stock del tono ni un servicio real de recogida.
export const MAYBELLINE_STORE_LOCATOR = "https://www.maybelline.co/encuentra-una-tienda";
const exito = "https://www.exito.com/t/maybelline";
const exitoDirectory = "https://www.exito.com/almacenes-exito";
const retailPoints = [
  { id:"farmatodo-parque-93",name:"Farmatodo Parque 93",retailer:"Farmatodo",address:"Calle 93A #12-73, Local 5, Bogotá, Colombia",lat:4.6766575,lng:-74.0491807,retailerUrl:"https://www.farmatodo.com.co/a/p/maybelline.html",addressSource:"https://www.farmatodo.com.co/tiendas" },
  { id:"exito-chapinero",name:"Éxito Chapinero",retailer:"Éxito",address:"Calle 52 #13-70, Bogotá, Colombia",lat:4.63978,lng:-74.06575,retailerUrl:exito,addressSource:exitoDirectory },
  { id:"exito-country",name:"Éxito Country",retailer:"Éxito",address:"Calle 134 #9-51, Bogotá, Colombia",lat:4.7122994,lng:-74.03412449,retailerUrl:exito,addressSource:exitoDirectory },
  ...[
    ["san-martin","Éxito San Martín","Carrera 7 #32-84"],
    ["villa-mayor","Éxito Villa Mayor","Autopista Sur #32-84"],
    ["americas","Éxito Américas","Avenida Las Américas #68A-94"],
    ["calle-80","Éxito Calle 80","Carrera 59A #79-30"],
    ["colina","Éxito Colina","Avenida Boyacá #72-146B"],
    ["fontibon","Éxito Fontibón","Avenida Centenario #106-104"],
    ["norte","Éxito Norte","Calle 175 #22-13"],
    ["suba","Éxito Suba","Avenida Calle 145 #105B-58"],
    ["floresta","Éxito Floresta","Avenida 68 #90-88"],
    ["tintal","Éxito Tintal","Avenida Ciudad de Cali #6-37"],
    ["20-julio","Éxito 20 de Julio","Calle 21 Sur #5A-34"],
    ["quirinal","Éxito Quirinal","Calle 60 #56A-40"],
    ["modelia","Éxito Modelia","Carrera 75 #23F-30"],
    ["restrepo","Éxito Restrepo","Carrera 20 #14-17 Sur"],
    ["ciudad-tunal","Éxito Ciudad Tunal","Calle 47B Sur #24B-33"],
    ["plaza-salitre","Éxito Plaza Salitre","Carrera 68B #24-39"],
    ["gran-estacion","Éxito Gran Estación","Avenida Esperanza #62-49, Local 134"],
  ].map(([id,name,address])=>({ id:`exito-${id}`,name,retailer:"Éxito",address:`${address}, Bogotá, Colombia`,retailerUrl:exito,addressSource:exitoDirectory })),
  // 30 sucursales adicionales verificadas en el directorio oficial Farmatodo Colombia.
  // Un punto de Farmatodo no equivale a una boutique exclusiva Maybelline ni
  // garantiza existencias, disponibilidad de tonos o recogida real.
  ...[
    ["la-calleja", "La Calleja", "Av. Carrera 19 #127-53"],
    ["autonorte", "Autonorte", "Carrera 45 #104-12"],
    ["centro-internacional", "Centro Internacional", "Carrera 13 #27-08"],
    ["avenida-19", "Avenida 19", "Avenida Calle 100 #19-05"],
    ["bella-suiza", "Bella Suiza", "Carrera 7 #129-39"],
    ["cosmos-100", "Cosmos 100", "Transversal 21 #98-71, Local 101"],
    ["rosales", "Rosales", "Diagonal 70A #4-87"],
    ["normandia", "Normandía", "Calle 53 #72-49"],
    ["hayuelos", "Hayuelos", "Carrera 90 #23J-22"],
    ["cedritos-1", "Cedritos 1", "Avenida Carrera 19 #139-78"],
    ["calle-119", "Calle 119", "Calle 119 #13-15"],
    ["cedritos-2", "Cedritos 2", "Calle 140 #13-27"],
    ["calle-74", "Calle 74", "Calle 74 #5-09"],
    ["calle-170", "Calle 170", "Calle 170 #65-80"],
    ["pasadena", "Pasadena", "Carrera 53 #103B-08"],
    ["calle-147", "Calle 147", "Avenida Carrera 19 #146-81"],
    ["santa-isabel", "Santa Isabel", "Carrera 30 #2B-17"],
    ["gran-estacion", "Gran Estación", "Calle 26 #52A-15"],
    ["salitre", "Salitre", "Avenida Calle 24 #59-60, Local 1"],
    ["san-cipriano", "San Cipriano", "Carrera 56 #167-30"],
    ["country", "Country", "Carrera 15 #94-72"],
    ["connecta", "Connecta", "Avenida Calle 26 #92-32, Lote L-3"],
    ["usaquen", "Usaquén", "Carrera 7 #116-50"],
    ["rincon-chico", "Rincón del Chicó", "Calle 106 #15-26"],
    ["la-cabrera", "La Cabrera", "Carrera 9 #82-19"],
    ["carrera-16", "Carrera 16", "Carrera 16 #82-52"],
    ["navarra", "Navarra", "Avenida Carrera 19 #103-98"],
    ["pepe-sierra", "Pepe Sierra", "Calle 116 #18B-43"],
    ["mazuren", "Mazurén", "Avenida Carrera 45 #147A-31"],
    ["calle-127", "Calle 127", "Calle 127 #17A-27"],
  ].map(([id,branch,address])=>({
    id:`farmatodo-${id}`, name:`Farmatodo ${branch}`, retailer:"Farmatodo",
    address:`${address}, Bogotá, Colombia`,
    retailerUrl:"https://www.farmatodo.com.co/a/p/maybelline.html",
    addressSource:"https://www.farmatodo.com.co/tiendas",
  }))
];
export default retailPoints;
