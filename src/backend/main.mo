import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Int "mo:core/Int";
import Migration "migration";

(with migration = Migration.run)
actor {
  type ProductId = Nat;

  public type Product = {
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

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };

    public func compareByName(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.name, product2.name);
    };

    public func compareByPrice(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.price, product2.price);
    };

    public func compareByCategory(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.category, product2.category);
    };
  };

  public type CartItem = {
    productId : ProductId;
    quantity : Nat;
  };

  module CartItem {
    public func compare(cart1 : CartItem, cart2 : CartItem) : Order.Order {
      Nat.compare(cart1.productId, cart2.productId);
    };
  };

  type OrderId = Nat;

  public type Order = {
    id : OrderId;
    user : Principal;
    items : [CartItem];
    total : Nat;
    timestamp : Time.Time;
  };

  public type RedemptionType = {
    #cashback : Nat;
    #mysteryBox : Text;
  };

  public type Redemption = {
    id : Nat;
    user : Principal;
    points : Nat;
    reward : RedemptionType;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var bootstrapClaimed = false;

  let products = Map.empty<ProductId, Product>();
  let carts = Map.empty<Principal, Set.Set<CartItem>>();
  let orders = Map.empty<OrderId, Order>();
  let loyaltyPoints = Map.empty<Principal, Nat>();
  let redemptions = Map.empty<Nat, Redemption>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextProductId = 1;
  var nextOrderId = 1;
  var nextRedemptionId = 1;

  public shared ({ caller }) func requestBootstrap(adminPassword : Text) : async () {
    let expectedPassword = "miang275@";

    // Check if bootstrap is still available
    if (bootstrapClaimed) {
      Runtime.trap("Bootstrap already claimed");
    };

    // This call internally compares the adminToken (hardcoded backend value)
    // with the userProvidedToken (password provided by the user).
    // Admin privileges are only granted if the tokens match.
    AccessControl.initialize(accessControlState, caller, expectedPassword, adminPassword);

    // Mark bootstrap as claimed after successful password validation
    bootstrapClaimed := true;

    // Verify that admin permissions were successfully granted
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Bootstrap failed: Admin permissions not granted");
    };
  };

  public func hasAnyAdmin() : async Bool {
    bootstrapClaimed;
  };

  public func isBootstrapAvailable() : async Bool {
    not bootstrapClaimed;
  };

  public query ({ caller }) func getCallerPrincipal() : async Text {
    caller.toText();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createProduct(
    name : Text,
    price : Nat,
    description : Text,
    category : Text,
    stock : Nat,
    imageUrls : [Text],
    points : Nat,
  ) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    let product : Product = {
      id = nextProductId;
      name;
      price;
      description;
      category;
      stock;
      imageUrls;
      isActive = true;
      points;
    };

    products.add(nextProductId, product);
    let currentId = nextProductId;
    nextProductId += 1;
    currentId;
  };

  public shared ({ caller }) func updateProduct(productId : ProductId, name : Text, price : Nat, description : Text, category : Text, stock : Nat, imageUrls : [Text], isActive : Bool, points : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    let product : Product = {
      id = productId;
      name;
      price;
      description;
      category;
      stock;
      imageUrls;
      isActive;
      points;
    };

    products.add(productId, product);
  };

  public shared ({ caller }) func toggleProductActive(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle products");
    };

    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };

    let updatedProduct : Product = {
      id = product.id;
      name = product.name;
      price = product.price;
      description = product.description;
      category = product.category;
      stock = product.stock;
      imageUrls = product.imageUrls;
      isActive = not product.isActive;
      points = product.points;
    };

    products.add(productId, updatedProduct);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProduct(productId : ProductId) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func addToCart(productId : ProductId, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };

    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };

    if (not product.isActive or product.stock < quantity) {
      Runtime.trap("Product unavailable or insufficient stock");
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) { Set.empty<CartItem>() };
      case (?cart) { cart };
    };

    currentCart.add({
      productId;
      quantity;
    });
    carts.add(caller, currentCart);
  };

  public shared ({ caller }) func removeFromCart(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) { Set.empty<CartItem>() };
      case (?cart) { cart };
    };

    let filteredCart = Set.empty<CartItem>();
    currentCart.values().forEach(
      func(item) {
        if (item.productId != productId) {
          filteredCart.add(item);
        };
      }
    );
    carts.add(caller, filteredCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };

    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.values().toArray().sort() };
    };
  };

  public shared ({ caller }) func placeOrder() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) { cart };
    };

    let total = cart.values().toArray().foldLeft(
      0,
      func(acc, item) {
        let price = switch (products.get(item.productId)) {
          case (null) { Runtime.trap("Product does not exist") };
          case (?product) { product.price };
        };
        acc + price * item.quantity;
      },
    );

    if (total == 0) { Runtime.trap("Cart is empty") };

    let order : Order = {
      id = nextOrderId;
      user = caller;
      items = cart.values().toArray().sort();
      total;
      timestamp = Time.now();
    };

    orders.add(nextOrderId, order);

    let currentPoints = switch (loyaltyPoints.get(caller)) {
      case (null) { 0 };
      case (?points) { points };
    };

    let pointsEarned = cart.values().toArray().foldLeft(
      0,
      func(acc, item) {
        let productPoints = switch (products.get(item.productId)) {
          case (null) { 0 };
          case (?product) { product.points };
        };
        acc + productPoints * item.quantity;
      },
    );

    loyaltyPoints.add(caller, currentPoints + pointsEarned);
    carts.remove(caller);
    nextOrderId += 1;
  };

  public query ({ caller }) func getPointsBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view points balance");
    };

    switch (loyaltyPoints.get(caller)) {
      case (null) { 0 };
      case (?points) { points };
    };
  };

  public shared ({ caller }) func redeemPoints(reward : RedemptionType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can redeem points");
    };

    let pointsRequired : Nat = switch (reward) {
      case (#cashback(_)) { 20 };
      case (#mysteryBox(_)) { 20 };
    };

    let points = switch (loyaltyPoints.get(caller)) {
      case (null) { 0 };
      case (?p) { p };
    };

    if (points < pointsRequired) { Runtime.trap("Not enough points for redemption") };

    let redemption : Redemption = {
      id = nextRedemptionId;
      user = caller;
      points = pointsRequired;
      reward;
      timestamp = Time.now();
    };

    loyaltyPoints.add(caller, points - pointsRequired : Nat);
    redemptions.add(Int.abs(nextRedemptionId), redemption);
    nextRedemptionId += 1;
  };
};
