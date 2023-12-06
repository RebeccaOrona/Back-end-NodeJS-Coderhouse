import CartsDao from "../daos/carts.dao.js";
import ProductsDao from "../daos/products.dao.js";
import UsersDao from "../daos/users.dao.js";
import TicketDao from "../daos/tickets.dao.js";
import ChatDao from "../daos/chat.dao.js";
import cartRepository from "./cart.repository.js";
import productRepository from "./product.repository.js";
import userRepository from "./user.repository.js";
import ticketRepository from "./ticket.repository.js";
import chatRepository from "./chat.repository.js";


export const CartsService = new cartRepository(CartsDao)
export const ProductsService = new productRepository(ProductsDao)
export const UserService = new userRepository(UsersDao)
export const TicketService = new ticketRepository(TicketDao)
export const ChatService = new chatRepository(ChatDao)