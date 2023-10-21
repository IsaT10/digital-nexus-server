const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kfd97zi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    //create databse collection
    const productCollection = client
      .db("digitalNexusDB")
      .collection("products");
    const brandCollection = client.db("digitalNexusDB").collection("brands");

    const cartCollection = client.db("digitalNexusDB").collection("cart");

    //get brands

    app.get("/brands", async (req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    });

    //get products

    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    //get cart items

    app.get("/cart", async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });

    //get apecific brand products

    app.get("/products/:brand", async (req, res) => {
      const { brand } = req.params;
      const query = { brandName: brand };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    //get specific product

    app.get("/product/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    //get specific email cart

    app.get("/cart/:email", async (req, res) => {
      const { email } = req.params;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    //post single product

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    //post cart item

    app.post("/cart", async (req, res) => {
      const product = req.body;
      const result = await cartCollection.insertOne(product);
      res.send(result);
    });

    //update product

    app.put("/products/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          rating: updateProduct.rating,
          price: updateProduct.price,
          type: updateProduct.type,
          brandName: updateProduct.brandName,
          name: updateProduct.name,
          image: updateProduct.image,
          shortDescription: updateProduct.shortDescription,
        },
      };
      const result = await productCollection.updateOne(query, product, options);
      res.send(result);
    });

    //delete cart item

    app.delete("/cart/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("digital nexus server is running");
});

app.listen(port, () => {
  console.log(`digital nexus server is running :${port}`);
});
