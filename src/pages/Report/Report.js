import React from 'react'
import LayoutWithSidebar from '../../components/LayoutWithSidebar'
import NavbarTwo from '../../components/NavbarTwo'
import NameHeader from '../../components/NameHeader'
import NewReport from '../../components/NewReport'
import Search from '../../Assets/IconAndLogo/search-status.png'
import Icon1 from '../../Assets/IconAndLogo/icon.png'
import Icon2 from '../../Assets/IconAndLogo/icon 2.png'
// import Icons from '../../Assets/IconAndLogo/arrows.png'
import Icon3 from '../../Assets/IconAndLogo/Group 3.png'
import Icon4 from '../../Assets/IconAndLogo/state-layer.png'
import Icon5 from '../../Assets/IconAndLogo/Group 5.png'
import Icon6 from '../../Assets/IconAndLogo/fa6-solid_naira-sign.png'
import Left from '../../Assets/IconAndLogo/primary (1).png'
import Right from '../../Assets/IconAndLogo/primary (2).png'
import Down from '../../Assets/IconAndLogo/primary.png'
import Img1 from '../../Assets/IconAndLogo/Frame 2755.png'
// import Modal from '../../components/Modal'

function Report() {

    return (
        <div>

            <div className="Report">
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-body EditBodyReport">
                                <center>
                                    <img src={Img1} alt="" />
                                    <p>Are you sure you want to Edit this entry?</p>
                                    <div className="buttonss">
                                        <button type="button" class="btn cancel" data-bs-dismiss="modal">Cancel</button>
                                        <button type="button" class="btn success">Yes, edit</button>
                                    </div>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>
                <LayoutWithSidebar >
                    <div className="Report">
                        <NavbarTwo
                            header="Report"
                        />
                        <div className="margin75"></div>

                        <div className="p-30">
                            <div className="padding20"></div>
                            <NameHeader
                                name="Emma Taylor"
                            />
                            <NewReport
                                Type="New"
                            />
                            <div className="WhiteCard">
                                <div className="header mb-3">
                                    <h2>All Report</h2>
                                </div>
                                <div className="Check mb-4">
                                    <div className="search flexDiv">
                                        <input type="text" placeholder='Search Patient Name' />
                                        <img src={Search} alt="" />
                                    </div>
                                    <div className="sort flexDiv">
                                        <p>Sort by:</p>
                                        <div className="">
                                            <div class="form">
                                                <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
                                                    <option value="1">Newest to oldest</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="filter flexDiv">
                                        <img src={Icon1} alt="" />
                                        <p>Filter by</p>
                                    </div>
                                    <div className="export flexDiv">
                                        <img src={Icon2} alt="" />
                                        <p>Export</p>
                                    </div>
                                </div>
                                <div className="reportTable">
                                    <div className="header mb-3">
                                        <h2>All Report</h2>
                                    </div>
                                    <div className="">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th scope="col">Date & Time</th>
                                                    <th scope="col">Procedure/Test Ordered</th>
                                                    <th scope="col">Age of Patient</th>
                                                    <th scope="col">Referrer’s Name</th>
                                                    <th scope="col">Referrer’s Hospital</th>
                                                    <th scope="col">Phone Number</th>
                                                    <th scope="col">Amount</th>
                                                    <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className=''>
                                                    <th scope="row">
                                                        <div className="flexDiv">
                                                            <img src={Icon3} alt="" />
                                                            <span>001</span>
                                                        </div>
                                                    </th>
                                                    <td>Cholesterol Profile</td>
                                                    <td>35</td>
                                                    <td>Emmanuel Umunna</td>
                                                    <td>Agape Care Laboratory</td>
                                                    <td>+234 7085646378</td>
                                                    <td>
                                                        <div className="flexDiv">
                                                            <img src={Icon6} alt="" />
                                                            <span>1,000.00</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dot">
                                                            <img className='' src={Icon5} alt="" />
                                                            <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                                <div className="firstDiv">
                                                                    <div className="flex">
                                                                        <img src={Icon4} alt="" />
                                                                        <span>Edit</span>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <div className="flexDiv">
                                                            <img className='plus' src={Icon3} alt="" />
                                                            <span>001</span>
                                                        </div>
                                                    </th>
                                                    <td>Cholesterol Profile</td>
                                                    <td>35</td>
                                                    <td>Emmanuel Umunna</td>
                                                    <td>Agape Care Laboratory</td>
                                                    <td>+234 7085646378</td>
                                                    <td>
                                                        <div className="flexDiv">
                                                            <img className='naira' src={Icon6} alt="" />
                                                            <span>1,000.00</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dot">
                                                            <img className='' src={Icon5} alt="" />
                                                            <div className="firstDiv">
                                                                <button type="button" class="" data-bs-toggle="modal" data-bs-target="#exampleModal">

                                                                    <div className="flex">
                                                                        <img src={Icon4} alt="" />
                                                                        <span>Edit</span>
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="perPage mt-3">
                                        <div className="abs">
                                            <div className="ms-2 me-2">
                                                <p>Items per page</p>
                                            </div>
                                            <div className="bord ms-2 me-2 flexDiv">
                                                <p className='me-2'>8</p>
                                                <img src={Down} alt="" />
                                            </div>
                                            <div className="LeftRight ms-2 me-2">
                                                <div className="bord ms-2 me-2">
                                                    <img src={Left} alt="" />
                                                </div>
                                                <div className="bord ms-2 me-2">
                                                    <img src={Right} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="margin50"></div>
                                <div className="data">
                                    <p>Showing 10 from 160 data</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </LayoutWithSidebar>
            </div>
        </div>
    )
}

export default Report