import Carousel from "./Carousel";
import GetAllCategories from "../productComponent/GetAllCategories";
import ProductCard from "../productComponent/AdminProductCard";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const DeleteProductPage = () => {
  const user = JSON.parse(sessionStorage.getItem("active-admin"));
  const [totalPrice, setTotalPrice] = useState("");
  const [myProductData, setMyProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = categoryId
          ? await retrieveProductsByCategory()
          : await retrieveAllProducts();

        setMyProductData(allProducts);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
    sessionStorage.removeItem("active-admin");
  }, [categoryId]);

  const retrieveAllProducts = async () => {
    const response = await axios.get("http://localhost:8080/api/product/all");
    return response.data;
  };

  const retrieveProductsByCategory = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/product/category?categoryId=${categoryId}`
    );
    return response.data;
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/product/delete/${id}`);
      setMyProductData(myProductData.filter((product) => product.id !== id));
      toast.success("Product deleted successfully!", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 custom-bg border-color"
        style={{ height: "45rem" }}
      >
        <div className="card-header text-center bg-color custom-bg-text">
          <h2>Product List</h2>
        </div>
        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="table-responsive">
            <table className="table table-hover custom-bg-text text-center">
              <thead className="bg-color table-bordered border-color">
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="text-color">
                {myProductData.map((productData) => (
                  <tr key={productData.id}>
                    <td>
                      <img
                        src={`http://localhost:8080/api/product/${productData.imageName}`}
                        className="img-fluid"
                        alt="product_pic"
                        style={{ maxWidth: "90px" }}
                      />
                    </td>
                    <td><b>{productData.title}</b></td>
                    <td><b>{productData.description}</b></td>
                    <td><b>{productData.quantity}</b></td>
                    <td>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => deleteProduct(productData.id)}
                      >
                        Remove product
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ToastContainer />
          </div>
        </div>
        <div className="card-footer custom-bg">
          <div className="float-right"></div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductPage;
