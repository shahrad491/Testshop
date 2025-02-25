import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import {
  useUpdateProductMutation,
  useGetProductDetailQuery,
  useUploadProductImageMutation,
} from "../../slices/product.slice";

const ProductEditScreen = () => {
  const navigate = useNavigate();

  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);

  const {
    data: product,
    isLoading: loadingProduct,
    error: productErr,
    refetch,
  } = useGetProductDetailQuery(productId);

  const [
    updateProduct,
    { isLoading: loadingUpdateProduct, error: updateProductErr },
  ] = useUpdateProductMutation();

  const [uploadProductImg, { isLoading: loadingUploadImg }] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setDescription(product.description);
      setCountInStock(product.countInStock);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      productId,
      name,
      price,
      image,
      brand,
      category,
      description,
      countInStock,
    };

    const res = await updateProduct(updatedProduct);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Product Updated Successfully");
      refetch();
      navigate("/admin/productlist");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    console.log(formData);
    try {
      const res = await uploadProductImg(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <>
      <Link to={`/admin/productlist`} className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdateProduct && <Loader />}

        {loadingProduct ? (
          <Loader />
        ) : productErr ? (
          <Message varient="danger">{productErr}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price" className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Product Price"
                value={price}
                min={0}
                step={0.01}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Image URL"
                value={image}
                disabled={true}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              ></Form.Control>
              <Form.Control
                type="file"
                lable="Choose File"
                onChange={uploadFileHandler}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Brand"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>Count in Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Product Count in Stock"
                value={countInStock}
                min={0}
                onChange={(e) => {
                  setCountInStock(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                as={"textarea"}
                className="fieldSizing"
                style={{ resize: "none" }}
                placeholder="Product Description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" className="my-2">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
