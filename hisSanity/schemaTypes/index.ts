
import  DatabaseConnection  from "@/lib/mongodb/mongodb";
import Category from "@/models/categoryType";

export async function GET(){

 await DatabaseConnection();

 const categories = await Category.find();

 return Response.json(categories);
}


// import { type SchemaTypeDefinition } from "sanity";
// import { categoryType } from "./categoryType";
// import { productType } from "./productType";
// import { blockContentType } from "./blockContentType";
// import { OrderType } from "./orderType";
// import { brandType } from "./brandType";

// export const schema: {types: SchemaTypeDefinition[]} = {
//     types: [categoryType, productType, blockContentType, OrderType, brandType, blogType, blogCategoryType, authorType, addressType],

// }