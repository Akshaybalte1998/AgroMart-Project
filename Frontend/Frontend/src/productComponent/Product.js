import GetAllCategories from "../productComponent/GetAllCategories";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../productComponent/ProductCard";
import { ToastContainer, toast } from "react-toastify";

const Product = () => {
  const { productId, categoryId } = useParams();

  let user = JSON.parse(sessionStorage.getItem("active-user"));

  const [quantity, setQuantity] = useState("");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    id: "",
    title: "",
    description: "",
    quantity: "",
    price: "",
    imageName: "",
    category: { id: "", title: "" },
  });

  const retrieveProduct = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/product/id?productId=" + productId
    );
    return response.data;
  };

  useEffect(() => {
    const getProduct = async () => {
      const retrievedProduct = await retrieveProduct();
      setProduct(retrievedProduct);
    };

    const getProductsByCategory = async () => {
      const allProducts = await retrieveProductsByCategory();
      if (allProducts) {
        setProducts(allProducts);
      }
    };

    getProduct();
    getProductsByCategory();
  }, [productId]);

  const retrieveProductsByCategory = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/product/category?categoryId=" + categoryId
    );
    return response.data;
  };

  const saveProductToCart = (userId) => {
    fetch("http://localhost:8080/api/user/cart/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: quantity,
        userId: userId,
        productId: productId,
      }),
    }).then((result) => {
      toast.success("Added to Cart!", {
        position: "top-center",
        autoClose: 800,
        hideProgressBar: true,
      });

      result.json().then((res) => {
        console.log("response", res);
      });
    });
  };

  const addToCart = (e) => {
    if (user == null) {
      alert("Please login to add products to the cart.");
      e.preventDefault();
    } else {
      saveProductToCart(user.id);
      setQuantity("");
      e.preventDefault();
    }
  };

  return (
    <div className="container-fluid">
      <style>
        {`
          .custom-bg {
            background-color: #f5f7fa;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          .custom-bg-text {
            color: #343a40;
            font-weight: 600;
          }
          .border-color {
            border: 1px solid #ced4da;
          }
          .bg-color {
            background-color: #e9ecef;
          }
          .text-color {
            color: #495057;
          }
          .admin {
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .btn {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 7px 20px;
            font-size: 0.875rem;
            transition: background-color 0.3s ease, transform 0.3s ease;
            margin-right: 10px;
          }
          .btn:hover {
            background-color: #0056b3;
            transform: scale(1.05);
          }
          .card-img-top {
            transition: transform 0.2s ease-in-out;
            border-radius: 8px;
          }
          .card-img-top:hover {
            transform: scale(1.1);
          }
          .product-title {
            font-weight: 700;
            font-size: 1.5rem;
            margin-bottom: 10px;
          }
          .product-description {
            font-size: 1rem;
            margin: 15px 0;
            color: #6c757d;
          }
          .product-price {
            font-size: 1.25rem;
            font-weight: bold;
            color: #28a745;
          }
          .product-stock {
            font-size: 0.875rem;
            color: #6c757d;
          }
          .related-products-title {
            margin-top: 30px;
            font-size: 1.75rem;
            font-weight: 600;
            color: #495057;
          }
          .form-control {
            border-radius: 5px;
            font-size: 0.875rem;
            padding: 7px 12px;
          }
          .quantity-input {
            max-width: 100px;
            text-align: center;
          }
        `}
      </style>

      <div className="row">
        <div className="col-sm-2 mt-2">
          <GetAllCategories />
        </div>
        <div className="col-sm-3 mt-2 admin">
          <div className="card form-card border-color custom-bg">
            <img
              src={"http://localhost:8080/api/product/" + product.imageName}
              style={{
                maxHeight: "350px",
                maxWidth: "100%",
                objectFit: "cover",
              }}
              className="card-img-top mx-auto d-block m-2"
              alt="Product"
            />
          </div>
        </div>
        <div className="col-sm-7 mt-2">
          <div className="card form-card border-color custom-bg">
            <div className="card-header bg-color">
              <h1 className="custom-bg-text product-title">{product.title}</h1>
            </div>

            <div className="card-body text-left text-color">
              <div className="text-left mt-3">
                <h4>Description:</h4>
              </div>
              <p className="product-description">{product.description}</p>
            </div>

            <div className="card-footer custom-bg">
              <div className="text-center text-color">
                <p className="product-price">Price: ₹{product.price}</p>
                <p className="product-stock">Available Stock: {product.quantity}</p>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <form className="row g-3" onSubmit={addToCart}>
                  <div className="col-auto">
                    <input
                      type="number"
                      className="form-control quantity-input"
                      id="addToCart"
                      placeholder="Qty"
                      min={1}
                      max={product.quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      value={quantity}
                      required
                    />
                  </div>
                  <div className="col-auto">
                    <input
                      type="submit"
                      className="btn"
                      value="Add to Cart"
                    />
                    <ToastContainer />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-sm-2"></div>
        <div className="col-sm-10">
          <h2 className="related-products-title">Related Products:</h2>
          <div className="row row-cols-1 row-cols-md-4 g-4">
            {products.map((product) => {
              return <ProductCard item={product} key={product.id} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
