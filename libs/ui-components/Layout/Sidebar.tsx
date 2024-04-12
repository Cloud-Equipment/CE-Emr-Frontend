import { NavLink } from 'react-router-dom';
import './Layout.scss';
import { useDispatch, useSelector } from 'react-redux';
import { IUser, UserTypeEnum } from '@cloud-equipment/models';
import { closeSidebar } from '@cloud-equipment/shared_store';
import * as Assets from '@cloud-equipment/assets';
import { IAppState } from 'apps/cloud-equipment/src/Store/store';
import { INavItem } from './types';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

const Sidebar = ({
  userDetails,
  navlinks,
  sidebarExpanded,
  toggleSidebarExpanded,
  onLogout,
}: {
  userDetails: IUser | null;
  navlinks: INavItem[];
  sidebarExpanded: boolean;
  toggleSidebarExpanded: () => void;
  onLogout: () => void;
}) => {
  const sidebarOpen = useSelector(
    (state: IAppState) => state.shared.sidebarOpen
  );
  const accountType = useSelector(
    (state: { account: { accountType: 0 | 1 } }) => state.account.accountType
  );

  const dispatch = useDispatch();

  const handleCloseSidebar = () => {
    dispatch(closeSidebar());
  };

  return (
    <aside
      className={`px-4 py-10 md:px-6 md:py-14 md:pr-10 bg-ce-green h-screen fixed top-0 [z-index:51] duration-500 w-[80%] max-w-[300px] text-sm text-white overflow-y-auto lg:!left-0 ${
        sidebarOpen ? ' left-0 ' : ' left-[-100%] '
      } 
      ${
        sidebarExpanded
          ? ' lg:w-[25%] lg:max-w-[300px] '
          : ' lg:px-2 lg:w-[70px] lg:max-w-[unset] collapsed-sidebar '
      }`}
    >
      <button
        className="btn-icon lg:hidden block ml-auto mb-4 mr-2 bg-white"
        onClick={handleCloseSidebar}
      >
        <img src={Assets.Icons.X} className="w-5" alt="" />
      </button>

      <button
        onClick={toggleSidebarExpanded}
        className="hidden lg:block text-white border-white absolute right-6 top-5"
      >
        <div className="minx">
          <div></div>
          <div></div>
        </div>
      </button>

      <div className="logoAndName">
        <img src={Assets.Images.Temp.DummyLogo} alt="Facility Logo" />
        <p className={`font-medium leading-5 collapse-hideText`}>
          {accountType === 0
            ? 'Cloud Equipment Superadmin'
            : userDetails?.FACILITY_NAME?.toUpperCase()}
        </p>
      </div>

      <p className="mt-10 px-4">
        <span className="collapse-hideText">MAIN</span>
      </p>

      <div className="mt-2">
        {navlinks.map((navItem, index) => {
          if (navItem?.children) {
            return (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<img src={Assets.Icons.WhiteArrowUp} alt="" />}
                  aria-controls={navItem.name}
                  id={navItem.name}
                >
                  <div className="px-4 py-3 flex items-center space-x-3 text-white">
                    <img className="w-6" src={navItem.img} alt={navItem.name} />
                    <span className="collapse-hideText">{navItem.name}</span>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="subnavs">
                    {navItem.children.map((item) => (
                      <NavLink
                        key={item.route}
                        onClick={handleCloseSidebar}
                        to={item.route}
                      >
                        <span className="collapse-hideText">{item.name}</span>
                        <img
                          className="hidden collapse-show"
                          src={item.img}
                          alt=""
                        />
                      </NavLink>
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>
            );
          } else {
            return (
              <NavLink
                key={index}
                onClick={handleCloseSidebar}
                to={navItem.route}
                className=" my-3 main-icon"
              >
                <img className="w-6" src={navItem.img} alt={navItem.name} />
                <span className="collapse-hideText">{navItem.name}</span>
              </NavLink>
            );
          }
        })}

        {/* logout common to all */}
        <button
          onClick={() => {
            onLogout();
            handleCloseSidebar();
          }}
          className="main-icon w-full"
        >
          <img className="w-6" src={Assets.Icons.Logout} alt="" />
          <span className="collapse-hideText">Logout</span>
        </button>
      </div>

      <div className="mt-10 flex justify-between items-center">
        <p className={`px-4 ${sidebarExpanded ? '' : 'hidden'}`}>MESSAGES</p>
        <button className={`px-4 ${sidebarExpanded ? 'btn-icon' : 'hidden'}`}>
          <img src={Assets.Icons.WhitePlus} alt="" />
        </button>
      </div>

      <div className="messaging-holder">
        <NavLink
          onClick={handleCloseSidebar}
          to="."
          className="messaging-navlink"
        >
          <img
            className="w-6 h-6 rounded-full"
            src={Assets.Images.Temp.DummyUserIcon}
            alt=""
          />
          <span className="collapse-hideText">Support</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
