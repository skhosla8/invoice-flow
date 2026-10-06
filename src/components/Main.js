import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { formatStatus, formatDate } from '../utilities';
import arrowDownIcon from '../assets/icon-arrow-down.svg';
import plusIcon from '../assets/icon-plus.svg';
import arrowRightIcon from '../assets/icon-arrow-right.svg';
import StatusDropdown from './StatusDropdown';
import InvoiceModal from './InvoiceModal';

function Main({ invoiceId, setInvoiceId }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isOpenNewInvoice, setIsOpenNewInvoice] = useState(false);

    const invoices = useSelector(state => state.invoices.allInvoices);

    const mainComponent = useRef(null);

    const numInvoices = invoices && invoices.length;

    const styleInvoiceStatus = () => {
        let elements = document.getElementsByClassName('invoice-status-container');

        for (const element of elements) {
            element.innerText.includes('Paid') ?
                element.classList.add('status-paid') :
                element.classList.remove('status-paid');


            element.innerText.includes('Pending') ?
                element.classList.add('status-pending') :
                element.classList.remove('status-pending');


            element.innerText.includes('Draft') ?
                element.classList.add('status-draft') :
                element.classList.remove('status-draft');
        }
    };

    const openInvoiceItem = (id) => {
        const viewInvoiceComponent = document.querySelector('.view-invoice');

        setInvoiceId(id);

        mainComponent.current.classList.add('hide');
        viewInvoiceComponent.classList.add('display');
    };

    const renderedInvoices = invoices && invoices.map((invoice, i) => (
        <div className='main__invoices__invoice' key={i} onClick={() => openInvoiceItem(invoice.id)}>
            <span className='invoice-id'>{invoice.id}</span>
            <span className='invoice-duedate'>Due {formatDate(invoice.paymentDue)}</span>
            <span className='invoice-client'>{invoice.clientName}</span>
            <span className='invoice-total'>&#163;{invoice.total.toFixed(2)}</span>
            <span className='invoice-status'>
                <div className='invoice-status-container'>
                    <span>&#x2B24;</span>{formatStatus(invoice.status)}
                </div>
            </span>
            <span className='invoice-open'>
                <img src={arrowRightIcon} alt='arrow-right' />
            </span>
        </div>
    ));

    const toggleStatusDropdown = () => {
        let statusDropdown = document.getElementById('dropdown-status');

        setShowDropdown(!showDropdown);

        if (!showDropdown) {
            statusDropdown.classList.add('visible');
        } else {
            statusDropdown.classList.remove('visible');
        }
    };

    const openNewInvoice = () => {
        setIsOpenNewInvoice(true);
    };

    useEffect(() => {
        styleInvoiceStatus();
    }, [invoices]);

    return (
        <div className="main" ref={mainComponent}>
            <div className="main__header">
                <div className="main__header__container1">
                    <div>Invoices</div>
                    <div>There are {numInvoices} total invoices</div>
                </div>

                <div className="main__header__container2">
                    <button className="status-filter" aria-expanded={showDropdown} aria-controls="dropdown-status" onClick={toggleStatusDropdown}>
                        Filter by status
                        <img src={arrowDownIcon} alt="arrow-down" />
                    </button>

                    <button onClick={openNewInvoice}>
                        <div>
                            <img src={plusIcon} alt="add-icon" />
                        </div>

                        <span>New Invoice</span>
                    </button>

                    <StatusDropdown />
                </div>
            </div>

            <div className="main__invoices">
                {renderedInvoices}
            </div>

            {isOpenNewInvoice &&
                <InvoiceModal
                    invoiceId={invoiceId}
                    isOpenNewInvoice={isOpenNewInvoice}
                    setIsOpenNewInvoice={setIsOpenNewInvoice}
                />
            }
        </div>
    )
}

export default Main;