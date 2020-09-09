import React from "react"
import { NavLink } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { BsBootstrap, BsCardChecklist } from "react-icons/bs"
import {
  AiOutlineHome,
  AiOutlinePlusSquare,
  AiOutlineLogout,
  AiOutlineUser,
} from "react-icons/ai"
import { BiBuildingHouse } from "react-icons/bi"
import { FiShoppingCart } from "react-icons/fi"
import { TOGGLE_DROP_MENU } from "../redux/menu/menuTypes"

const Navbar: React.FC = () => {
  const {
    auth: { userData },
    menu: { drop },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()

  const handleDrop = () => {
    dispatch({ type: TOGGLE_DROP_MENU })
  }

  return (
    <div className='nav'>
      <div className='nav__menu'>
        <NavLink to='/' className='link link__logo'>
          <BsBootstrap className='link__icon' />
          <span className='link__name'>Booking-Flat</span>
        </NavLink>

        <NavLink exact to='/' className='link' activeClassName='link--active'>
          <AiOutlineHome className='link__icon' />
          <span className='link__name'>Home</span>
        </NavLink>
        <NavLink
          to='/filter?type=flats'
          className='link'
          activeClassName='link--active'
        >
          <BiBuildingHouse className='link__icon' />
          <span className='link__name'>Flats</span>
        </NavLink>
        <NavLink to='/orders' className='link' activeClassName='link--active'>
          <FiShoppingCart className='link__icon' />
          <span className='link__name'>Orders</span>
        </NavLink>
        <NavLink
          to='/create-flat'
          className='link'
          activeClassName='link--active'
        >
          <AiOutlinePlusSquare className='link__icon' />
          <span className='link__name'>Create</span>
        </NavLink>
        <div className='drop-menu'>
          <button
            className={`drop-menu__btn link ${drop && "drop-menu__btn--open"}`}
            onClick={handleDrop}
          >
            <span className='drop-menu__container-img'>
              <img
                className='drop-menu__img'
                src={userData.user.ava}
                alt='userAva'
              />
            </span>
            <span className='drop-menu__name link__name'>
              {userData.user.firstname[0] + userData.user.lastname[0]}
            </span>
          </button>
          <div
            className={`drop-menu__container ${
              drop && "drop-menu__container--active"
            }`}
            onClick={() => dispatch({ type: TOGGLE_DROP_MENU })}
          >
            <NavLink
              to={`/user/${userData.user._id}`}
              className='link'
              activeClassName='link--active'
            >
              <AiOutlineUser className='link__icon' />
              <span className='link__name'>Profile</span>
            </NavLink>
            <button className='link'>
              <AiOutlineLogout className='link__icon' />
              <span className='link__name'>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
