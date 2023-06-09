import {StarIcon} from "@heroicons/react/24/solid";
import Image from "next/image";
import Currency from "react-currency-formatter";
import {useDispatch} from "react-redux";
import {IProduct} from "../../typings";
import {addToBasket, removeFromBasket} from "../slices/basketSlice";

type Props = {
    product: IProduct;
};

const CheckoutProduct = ({product}: Props) => {
    const {id, title, price, description, category, image, rating} =
        product;
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
        // Send product id to Redux Store to remove from basket
        dispatch(addToBasket(product));
    };
    const removeItemFromBasket = () => {
        // Send product to Redux Store as a basket slice action
        dispatch(removeFromBasket({id}));
    };

    return (
        <div className="grid grid-cols-5">
            <Image
                className="object-contain"
                src={image}
                width={200}
                height={200}
                alt={title}
            />
            {/* middle */}
            <div className="col-span-3 mx-5">
                <p>{title}</p>
                <div className="flex">
                    {Array(Math.round(rate))
                        .fill(0)
                        .map((_, i) => (
                            <StarIcon key={i.toString()} className="h-5 text-yellow-500"/>
                        ))}
                </div>
                <p className="text-xs my-2 line-clamp-3">{description}</p>
                <Currency quantity={price} currency="USD"/>
            </div>
            {/* Right */}
            <div className="flex flex-col space-y-2 my-auto justify-self-end">
                <button onClick={addItemToBasket} className="button mt-auto text-black font-semibold">Add to Cart
                </button>
                <button onClick={removeItemFromBasket} className="button mt-auto text-black font-semibold">Remove from
                    Cart
                </button>
            </div>
        </div>
    );
};

export default CheckoutProduct;
