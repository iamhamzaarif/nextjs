import {StarIcon} from "@heroicons/react/24/solid";
import Image from "next/image";
import Currency from "react-currency-formatter";
import {useDispatch} from "react-redux";
import {IProduct} from "../../typings";
import {addToBasket} from "../slices/basketSlice";

type Props = {
    product: IProduct;
};

const Product: React.FC<Props> = ({product}: Props) => {
    const {id, title, price, description, category, image, rating} = product;
    const {rate} = rating;
    const dispatch = useDispatch();

    const addItemToBasket = () => {
        const product = {
            id,
            title,
            price,
            description,
            category,
            image,
            rating,
        };
        // Send product to Redux Store as a basket slice action
        dispatch(addToBasket({...product}));
    };

    return (
        <>
            <div className="relative flex flex-col m-5 bg-white z-30 p-10">
                <p className="absolute top-2 right-2 text-xs italic text-gray-400">
                    {category}
                </p>
                <Image
                    className="object-contain w-40 h-40 mx-auto"
                    src={image}
                    width={200}
                    height={200}
                    alt={title}
                />
                <h4 className="my-3">{title}</h4>
                <div className="flex">
                    {Array(Math.round(rate))
                        .fill(0)
                        .map((_, i) => (
                            <StarIcon key={i.toString()} className="h-5 text-yellow-500"/>
                        ))}
                </div>
                <p className="text-xs my-2 line-clamp-2">{description}</p>
                <div className="mb-5">
                    <Currency quantity={price} currency="USD"/>
                </div>
                <button onClick={addItemToBasket} className="mt-auto button font-semibold text-black">
                    Add to Cart
                </button>
            </div>
        </>
    );
};

export default Product;
