import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";

module {
  type ProductId = Nat;

  type Product = {
    id : ProductId;
    name : Text;
    price : Nat;
    description : Text;
    category : Text;
    stock : Nat;
    imageUrls : [Text];
    isActive : Bool;
    points : Nat;
  };

  type CartItem = {
    productId : ProductId;
    quantity : Nat;
  };

  type OrderId = Nat;

  type Order = {
    id : OrderId;
    user : Principal;
    items : [CartItem];
    total : Nat;
    timestamp : Time.Time;
  };

  type RedemptionType = {
    #cashback : Nat;
    #mysteryBox : Text;
  };

  type Redemption = {
    id : Nat;
    user : Principal;
    points : Nat;
    reward : RedemptionType;
    timestamp : Time.Time;
  };

  type UserProfile = {
    name : Text;
  };

  type OldActor = {
    products : Map.Map<ProductId, Product>;
    carts : Map.Map<Principal, Set.Set<CartItem>>;
    orders : Map.Map<OrderId, Order>;
    loyaltyPoints : Map.Map<Principal, Nat>;
    redemptions : Map.Map<Nat, Redemption>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextProductId : Nat;
    nextOrderId : Nat;
    nextRedemptionId : Nat;
    bootstrapClaimed : Bool;
  };

  type NewActor = {
    products : Map.Map<ProductId, Product>;
    carts : Map.Map<Principal, Set.Set<CartItem>>;
    orders : Map.Map<OrderId, Order>;
    loyaltyPoints : Map.Map<Principal, Nat>;
    redemptions : Map.Map<Nat, Redemption>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextProductId : Nat;
    nextOrderId : Nat;
    nextRedemptionId : Nat;
    bootstrapClaimed : Bool;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
