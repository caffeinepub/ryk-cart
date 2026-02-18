import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type Product = {
    id : Nat;
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
    productId : Nat;
    quantity : Nat;
  };

  type Order = {
    id : Nat;
    user : Principal;
    items : [CartItem];
    total : Nat;
    timestamp : Int;
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
    timestamp : Int;
  };

  type UserProfile = {
    name : Text;
  };

  type OldActor = {
    adminInitialized : Bool;
    bootstrapRequested : Bool;
    bootstrapRequestedBy : ?Principal;
    products : Map.Map<Nat, Product>;
    carts : Map.Map<Principal, Set.Set<CartItem>>;
    orders : Map.Map<Nat, Order>;
    loyaltyPoints : Map.Map<Principal, Nat>;
    redemptions : Map.Map<Nat, Redemption>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextProductId : Nat;
    nextOrderId : Nat;
    nextRedemptionId : Nat;
  };

  type NewActor = {
    products : Map.Map<Nat, Product>;
    carts : Map.Map<Principal, Set.Set<CartItem>>;
    orders : Map.Map<Nat, Order>;
    loyaltyPoints : Map.Map<Principal, Nat>;
    redemptions : Map.Map<Nat, Redemption>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextProductId : Nat;
    nextOrderId : Nat;
    nextRedemptionId : Nat;
    bootstrapClaimed : Bool;
  };

  public func run(old : OldActor) : NewActor {
    {
      products = old.products;
      carts = old.carts;
      orders = old.orders;
      loyaltyPoints = old.loyaltyPoints;
      redemptions = old.redemptions;
      userProfiles = old.userProfiles;
      nextProductId = old.nextProductId;
      nextOrderId = old.nextOrderId;
      nextRedemptionId = old.nextRedemptionId;
      bootstrapClaimed = false;
    };
  };
};
