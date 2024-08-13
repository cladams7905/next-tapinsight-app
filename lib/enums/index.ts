export enum EventType {
  OnPurchase = "On Purchase",
  OnReview = "On Review",
  ActiveUsers = "Active Users",
  Custom = "Custom",
}

export enum EventIcons {
  EyeIcon,
  ShoppingBasket,
  ShoppingCart,
  UsersRound,
}

export enum Providers {
  Stripe = "Stripe",
  Google = "Google",
  TrustPilot = "TrustPilot",
  GoogleAnalytics = "Google Analytics",
}

export enum ScreenAlignment {
  BottomLeft = "Bottom Left",
  BottomRight = "Bottom Right",
  BottomCenter = "Bottom Center",
  TopLeft = "Top Left",
  TopRight = "Top Right",
  TopCenter = "Top Center",
}

export enum TemplateTypes {
  SmPopup = "Small popup",
  SmPopupNoImg = "Small popup (no image)",
  LgPopup = "Large popup",
  LgPopupNoImg = "Large popup (no image)",
  Card = "Card",
  CardNoImg = "Card (no image)",
  Banner = "Banner",
  BannerNoImg = "Banner (no image)",
}
