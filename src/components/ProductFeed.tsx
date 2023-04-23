import {IProduct} from "../../typings";
import Product from "./Product";

type Props = {
    products: IProduct[];
};

const ProductFeed = ({products}: Props) => {
    return (
        <div
            className="grid grid-flow-row-dense mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  md:-mt-75 lg:mt-75 xl:mt-20 mx-auto">
            {products.slice(8, 12).map((product) => (
                <Product key={product.id.toString()} product={product}/>
            ))}
        </div>
    );
};

export default ProductFeed;
