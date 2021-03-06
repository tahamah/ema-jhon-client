import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useCart from '../../hooks/useCart'
import useProducts from '../../hooks/useProducts'
import { addToDb, getStoredCart } from '../../utilities/fakedb'
import Cart from '../Cart/Cart'
import Product from '../Product/Product'
import './Shop.css'

const Shop = () => {
    const [cart, setCart] = useCart()
    const [pageCount, setPageCount] = useState(0)
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(10)
    const [products, setProducts] = useState([])

    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${page}&size=${size}`)
            .then((res) => res.json())
            .then((data) => setProducts(data))
    }, [page, size])

    useEffect(() => {
        fetch('http://localhost:5000/productCount')
            .then((res) => res.json())
            .then((data) => {
                const count = data.count
                const pages = Math.ceil(count / 10)
                setPageCount(pages)
            })
    }, [])

    const handleAddToCart = (selectedProduct) => {
        console.log(selectedProduct)
        let newCart = []
        const exists = cart.find(
            (product) => product._id === selectedProduct._id
        )
        if (!exists) {
            selectedProduct.quantity = 1
            newCart = [...cart, selectedProduct]
        } else {
            const rest = cart.filter(
                (product) => product._id !== selectedProduct._id
            )
            exists.quantity = exists.quantity + 1
            newCart = [...rest, exists]
        }

        setCart(newCart)
        addToDb(selectedProduct._id)
    }

    return (
        <>
            <div className="shop-container">
                <div className="products-container">
                    {products.map((product) => (
                        <Product
                            key={product._id}
                            product={product}
                            handleAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
                <div className="cart-container ">
                    <Cart cart={cart}>
                        <Link to="/orders">
                            <button className="mt-5 px-4 py-1 rounded-lg border bg-white font-bold hover:bg-[#ff9900] hover:text-white hover:translate-x-4 border-[#ff9900] duration-500">
                                Review Order
                            </button>
                        </Link>
                    </Cart>
                </div>
            </div>
            <div className="flex ml-10 mb-10">
                {[...Array(pageCount).keys()].map((number) => (
                    <button
                        onClick={() => setPage(number)}
                        className={
                            page === number
                                ? 'text-white bg-yellow-400 p-2 mr-2'
                                : 'border border-yellow-400 p-2 mr-2'
                        }
                    >
                        {number + 1}
                    </button>
                ))}
                <select
                    className="border border-yellow-400"
                    onChange={(e) => setSize(e.target.value)}
                >
                    <option value="5">5</option>
                    <option value="10" selected>
                        10
                    </option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>
        </>
    )
}

export default Shop
