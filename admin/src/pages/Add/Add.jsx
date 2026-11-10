import { useEffect, useRef, useState } from 'react'
import { assets } from '../../admin_assets/assets'
import axios from "axios"
import { toast } from 'react-toastify';
import { usePreferences } from "../../preferences";

const Add = ({ url, token }) => {
  const { t } = usePreferences();

  const [image, setImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const imagePreviewUrl = useRef("");

  useEffect(() => {
    return () => {
      if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current);
    };
  }, []);

  const selectImage = (file) => {
    if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current);
    imagePreviewUrl.current = file ? URL.createObjectURL(file) : "";
    setImagePreview(imagePreviewUrl.current);
    setImage(file || false);
  };

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad"
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const formData = new FormData();
      formData.append("name", data.name)
      formData.append("description", data.description)
      formData.append("price", Number(data.price))
      formData.append("category", data.category)
      formData.append("image", image)
      const response = await axios.post(`${url}/api/food/add`, formData, { headers: { token } });
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad"
        })
        setImage(false)
        toast.success(response.data.message)
      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="admin-page-heading"><span className="admin-eyebrow">{t("MENU MANAGEMENT")}</span><h1>{t("Add a new dish")}</h1><p>{t("Give your next favorite a place on the menu.")}</p></div>
        <div className="add-img-upload flex-col">
          <p>{t("Upload Image")}</p>
          <label htmlFor="image">
            <img src={imagePreview || assets.upload_area} alt={image ? t("Selected dish preview") : ""} />
          </label>
          <input onChange={(e) => selectImage(e.target.files?.[0])} type="file" id='image' accept="image/*" hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>{t("Product Name")}</p>
          <input aria-label={t("Product Name")} required onChange={onChangeHandler} value={data.name} name='name' placeholder='e.g. Truffle mushroom toast' />
        </div>
        <div className="add-product-description flex-col">
          <p>{t("Product Description")}</p>
          <textarea aria-label={t("Product Description")} onChange={onChangeHandler} value={data.description} name="description" rows='6' placeholder={t("Write content here")} required></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>{t("Product Category")}</p>
            <select aria-label={t("Product Category")} onChange={onChangeHandler} name="category" value={data.category}>
              <option value="Salad">{t("Salad")}</option>
              <option value="Rolls">{t("Rolls")}</option>
              <option value="Deserts">{t("Deserts")}</option>
              <option value="Sandwich">{t("Sandwich")}</option>
              <option value="Cake">{t("Cake")}</option>
              <option value="Pure Veg">{t("Pure Veg")}</option>
              <option value="Pasta">{t("Pasta")}</option>
              <option value="Noodles">{t("Noodles")}</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>{t("Product price")}</p>
            <input aria-label={t("Product price")} onChange={onChangeHandler} value={data.price} type="number" min="0.01" step="0.01" name='price' placeholder='€12.50' required />
          </div>
        </div>
        <button type='submit' className='add-btn'>{t("ADD")}</button>
      </form>
    </div>
  )
}

export default Add