import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatStatus, formatDate, navigateToHomepage } from '../utilities';
import arrowLeftIcon from '../assets/icon-arrow-left.svg';
import { updateInvoiceStatus } from '../redux/reducers/invoicesSlice';
import DeleteModal from './DeleteModal';
import InvoiceModal from './InvoiceModal';

function ViewInvoice({ invoiceId, setInvoiceId }) {
    const [isOpenEditInvoice, setIsOpenEditInvoice] = useState(false);

    const viewInvoiceComponent = useRef(null);
    const statusContainer = useRef(null);

    const currentInvoice = useSelector(state => state.invoices.allInvoices.find(obj => obj.id === invoiceId));

    const dispatch = useDispatch();

    const styleStatus = () => {
        statusContainer.current.innerText.includes('Paid') ?
            statusContainer.current.classList.add('status-paid') :
            statusContainer.current.classList.remove('status-paid');

        statusContainer.current.innerText.includes('Pending') ?
            statusContainer.current.classList.add('status-pending') :
            statusContainer.current.classList.remove('status-pending');


        statusContainer.current.innerText.includes('Draft') ?
            statusContainer.current.classList.add('status-draft') :
            statusContainer.current.classList.remove('status-draft');
    };

    const renderedInvoiceItems = currentInvoice && currentInvoice.items.map((item, i) => (
        <tr key={i} className="view-invoice__invoice__container4__item">
            <td>{item.name}</td>
            <td data-label="Qty.">{item.quantity}</td>
            <td data-label="Price">&#163;{item.price ? item.price.toFixed(2) : item.price}</td>
            <td>&#163;{item.total ? item.total.toFixed(2) : item.total}</td>
        </tr>
    ));

    const changeInvoiceStatus = () => {
        dispatch(updateInvoiceStatus({ invoiceId }));

        setTimeout(() => {
            navigateToHomepage();
            window.location.reload();
        }, 1000);
    };

    const openDeleteModal = () => {
        let deleteModal = document.querySelector('.delete-modal');
        let deleteModalOverlay = document.getElementById('delete-modal-overlay');

        deleteModal.classList.add('display');
        deleteModalOverlay.classList.add('overlay');
    };

    const openEditInvoice = () => {
        setIsOpenEditInvoice(true);
    };

    useEffect(() => {
        let markAsPaidBtn = document.getElementById('view-invoice-mark');

        if (currentInvoice && currentInvoice.status === 'paid') {
            markAsPaidBtn.disabled = true;
            markAsPaidBtn.style.opacity = 0.4;
        } else {
            markAsPaidBtn.disabled = false;
            markAsPaidBtn.style.opacity = 1;
        }

        styleStatus();
    }, [currentInvoice]);

    return (
        <div className="view-invoice" ref={viewInvoiceComponent}>
            <div className="view-invoice__navigate">
                <img src={arrowLeftIcon} alt="arrow-left" onClick={navigateToHomepage} />
                <span onClick={navigateToHomepage}>Go back</span>
            </div>

            <div className="view-invoice__header">
                <div className="view-invoice__header__container1">
                    Status
                    <div ref={statusContainer}>
                        <span>&#x2B24;</span>{currentInvoice && formatStatus(currentInvoice.status)}
                    </div>
                </div>

                <div className="view-invoice__header__container2">
                    <button id="view-invoice-edit" onClick={openEditInvoice}>Edit</button>
                    <button id="view-invoice-delete" onClick={openDeleteModal}>Delete</button>
                    <button id="view-invoice-mark" onClick={changeInvoiceStatus}>Mark as Paid</button>
                </div>
            </div>

            <div className="view-invoice__invoice">
                <div className="view-invoice__invoice__container1">
                    <div>
                        <div id="view-invoice-id">{currentInvoice && currentInvoice.id}</div>
                        <div>{currentInvoice && currentInvoice.description}</div>
                    </div>

                    <div id="view-invoice-senderAddress">
                        <div>{currentInvoice && currentInvoice.senderAddress.street}</div>
                        <div>{currentInvoice && currentInvoice.senderAddress.city}</div>
                        <div>{currentInvoice && currentInvoice.senderAddress.postCode}</div>
                        <div>{currentInvoice && currentInvoice.senderAddress.country}</div>
                    </div>
                </div>

                <div className="view-invoice__invoice__container2">
                    <div>
                        <div className="view-invoice__invoice__container2__label">Invoice Date</div>
                        <div className="view-invoice__invoice__container2__input">{currentInvoice && formatDate(currentInvoice.createdAt)}</div>
                    </div>

                    <div>
                        <div className="view-invoice__invoice__container2__label">Bill To</div>
                        <div className="view-invoice__invoice__container2__input">{currentInvoice && currentInvoice.clientName}</div>
                    </div>

                    <div>
                        <div className="view-invoice__invoice__container2__label">Sent to</div>
                        <div className="view-invoice__invoice__container2__input">{currentInvoice && currentInvoice.clientEmail}</div>
                    </div>
                </div>

                <div className="view-invoice__invoice__container3">
                    <div>
                        <div className="view-invoice__invoice__container2__label">Payment Due</div>
                        <div className="view-invoice__invoice__container2__input">{currentInvoice && formatDate(currentInvoice.paymentDue)}</div>
                    </div>

                    <div id="view-invoice-clientAddress">
                        <div>{currentInvoice && currentInvoice.clientAddress.street}</div>
                        <div>{currentInvoice && currentInvoice.clientAddress.city}</div>
                        <div>{currentInvoice && currentInvoice.clientAddress.postCode}</div>
                        <div>{currentInvoice && currentInvoice.clientAddress.country}</div>
                    </div>
                </div>

                <div className="view-invoice__invoice__container4">
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>QTY.</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderedInvoiceItems}
                        </tbody>
                    </table>

                    <div className="view-invoice__invoice__container4__total">
                        <div>
                            <div id="view-invoice-amount-due">Amount Due</div>
                            <div id="view-invoice-total">&#163;{currentInvoice && currentInvoice.total.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteModal
                invoiceId={invoiceId}
            />
            {isOpenEditInvoice &&
                <InvoiceModal
                    currentInvoice={currentInvoice}
                    invoiceId={invoiceId}
                    setInvoiceId={setInvoiceId}
                    isOpenEditInvoice={isOpenEditInvoice}
                    setIsOpenEditInvoice={setIsOpenEditInvoice}
                />
            }
        </div>
    )
}

export default ViewInvoice;