import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Stripe from 'stripe'
import axios from 'axios'
import { useState } from 'react'

import { stripe } from '@/lib/stripe'
import {
    ImageContainer,
    ProductContainer,
    ProductDetails,
} from '@/styles/pages/product'

interface ProductProps {
    product: {
        id: string
        imageUrl: string
        name: string
        price: string
        description: string
        defaultPriceId: string
    }
}

export default function Product({ product }: ProductProps) {
    const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
        useState(false)

    async function handleBuyProduct() {
        try {
            setIsCreatingCheckoutSession(true)
            const response = await axios.post('/api/checkout', {
                priceId: product.defaultPriceId,
            })
            const { checkoutUrl } = response.data
            window.location.href = checkoutUrl
        } catch (error) {
            setIsCreatingCheckoutSession(false)
            alert('Checkout error')
        }
    }

    return (
        <ProductContainer>
            <ImageContainer>
                <Image src={product.imageUrl} width={520} height={480} alt="" />
            </ImageContainer>

            <ProductDetails>
                <h1>{product.name}</h1>
                <span>{product.price}</span>
                <p>{product.description}</p>

                <button
                    onClick={handleBuyProduct}
                    disabled={isCreatingCheckoutSession}
                >
                    Comprar agora
                </button>
            </ProductDetails>
        </ProductContainer>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            {
                params: { id: 'prod_PIWsqjIcgBWmin' },
            },
        ],
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
    params,
}) => {
    const productId = params!.id

    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price'],
    })

    const price = product.default_price as Stripe.Price

    return {
        props: {
            product: {
                id: product.id,
                imageUrl: product.images[0],
                name: product.name,
                price:
                    price.unit_amount &&
                    new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    }).format(price.unit_amount / 100),
                description: product.description,
                defaultPriceId: price.id,
            },
        },
        revalidate: 60 * 60 * 1,
    }
}
