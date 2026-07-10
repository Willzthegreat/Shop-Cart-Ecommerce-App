
import  DatabaseConnection  from "@/lib/mongodb/mongodb";
import Category from "@/models/categoryType";

export async function GET(){

 await DatabaseConnection();

 const categories = await Category.find();

 return Response.json(categories);
}

