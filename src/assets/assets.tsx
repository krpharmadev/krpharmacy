import React from "react";

export const assets = {
    logo: '/public/logo.PNG',
    search_icon: '/public/search.svg',
    user_icon: '/public/user.svg',
    // ...อื่น ๆ
  };
  
  export function CartIcon() {
    return <span role="img" aria-label="cart">🛒</span>;
  }
  export function BagIcon() {
    return <span role="img" aria-label="bag">🛍️</span>;
  }
  export function BoxIcon() {
    return <span role="img" aria-label="box">📦</span>;
  }
  export function HomeIcon() {
    return <span role="img" aria-label="home">🏠</span>;
  }