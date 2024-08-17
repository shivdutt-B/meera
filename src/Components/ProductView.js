import React from 'react'

function ProductView() {
    return (
        <div className="main">
            <div className="gutter">
                <div className="product-info-container">
                    <div className="product-poster">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXte14l26_Enw8SuUYvLW5gcQygrm13IsyE32Aym8ed3z0ZBIm9VGr-mXXhNQU1zJN7Rs&usqp=CAU"></img>
                    </div>
                    <div className="product-info">
                        <div className="product-info-title">
                            <h3>iPhone X</h3>
                        </div>
                        <div className="product-info-info">
                            lorem ipsum dolor sit amet, consectetur adip lorem ipsum dolor
                        </div>
                        <div className="product-info-price">

                            <div className="original-discounted-price">

                                <div className="product-discounted-price">
                                <span className="original-price-slash"> <i class="fa-solid fa-indian-rupee-sign"></i>27346</span>
                                </div>

                                <div className="product-original-price">
                                    <i class="fa-solid fa-indian-rupee-sign"></i>
                                    <span className="original-price-slash">283</span>
                                </div>

                                <div className="product-discount-percentage">10</div>

                            </div>
                        </div>
                        <div className="product-info-description">

                        </div>
                        <div className="product-qnt-cart-buy">

                            <div className="product-info-qnt">
                                qnt
                            </div>
                            <div className="product-info-add-to-cart">
                                cart
                            </div>
                            <div className="product-info-buy-now">
                                buy
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ProductView