import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import plusIcon from '../assets/icon-plus-light.svg';
import deleteIcon from '../assets/icon-delete.svg';
import deleteIconRed from '../assets/icon-delete-red.svg';
import { addInvoice } from '../redux/reducers/invoicesSlice';
import { updateInvoice } from '../redux/reducers/invoicesSlice';

function InvoiceModal({ invoiceId, currentInvoice, isOpenNewInvoice, setIsOpenNewInvoice, isOpenEditInvoice, setIsOpenEditInvoice }) {
    const initialFormData = Object.freeze({
        id: '',
        createdAt: '',
        paymentDue: '',
        description: '',
        paymentTerms: '',
        clientName: '',
        clientEmail: '',
        status: '',
        senderAddress: {
            street: '',
            city: '',
            postCode: '',
            country: ''
        },
        clientAddress: {
            street: '',
            city: '',
            postCode: '',
            country: ''
        },
        items: [],
        total: ''
    });

    const initialFormErrors = Object.freeze({
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
    });

    const data = isOpenNewInvoice ? initialFormData : currentInvoice;
    const [formData, setFormData] = useState(data);

    const term = isOpenNewInvoice ? '' : currentInvoice.paymentTerms;
    const [selectedOption, setSelectedOption] = useState(term);

    const [items, setItems] = useState([]);
    const [itemsArr, setItemsArr] = useState([]);
    const [isNotValid, setIsNotValid] = useState(false);
    const [formErrors, setFormErrors] = useState(initialFormErrors);

    const formDataItems = formData?.items;
    const createdAt = formData?.createdAt;
    const paymentTerm = formData?.paymentTerms;
    const status = formData?.status;

    const dispatch = useDispatch();

    const handleChange = (e) => {
        if (e.target.name.includes('senderAddress')) {
            switch (e.target.name) {
                case 'senderAddress-street':
                    setFormData({
                        ...formData,
                        senderAddress: {
                            ...formData.senderAddress,
                            street: e.target.value
                        }
                    });

                    if (e.target.value) {
                        setFormErrors({
                            ...formErrors,
                            0: false
                        });
                    }

                    break;
                case 'senderAddress-city':
                    setFormData({
                        ...formData,
                        senderAddress: {
                            ...formData.senderAddress,
                            city: e.target.value
                        }
                    });

                    if (e.target.value) {
                        setFormErrors({
                            ...formErrors,
                            1: false
                        });
                    }

                    break;
                case 'senderAddress-postCode':
                    setFormData({
                        ...formData,
                        senderAddress: {
                            ...formData.senderAddress,
                            postCode: e.target.value
                        }
                    });

                    if (e.target.value) {
                        setFormErrors({
                            ...formErrors,
                            2: false
                        });
                    }

                    break;
                case 'senderAddress-country':
                    setFormData({
                        ...formData,
                        senderAddress: {
                            ...formData.senderAddress,
                            country: e.target.value
                        }
                    });

                    if (e.target.value) {
                        setFormErrors({
                            ...formErrors,
                            3: false
                        });
                    }

                    break;
                default:
                    isOpenNewInvoice ? setFormData(initialFormData) : setFormData(currentInvoice);
            }

        } else if (e.target.name.includes('clientAddress')) {
            switch (e.target.name) {
                case 'clientAddress-street':
                    setFormData({
                        ...formData,
                        clientAddress: {
                            ...formData.clientAddress,
                            street: e.target.value
                        }
                    });


                    if (e.target.value) {
                        setFormErrors({
                            ...formErrors,
                            6: false
                        });
                    }

                    break;
                case 'clientAddress-city':
                    setFormData({
                        ...formData,
                        clientAddress: {
                            ...formData.clientAddress,
                            city: e.target.value
                        }
                    });


                    if (e.target.value) {
                        setFormErrors({
                            ...formErrors,
                            7: false
                        });
                    }

                    break;
                case 'clientAddress-postCode':
                    setFormData({
                        ...formData,
                        clientAddress: {
                            ...formData.clientAddress,
                            postCode: e.target.value
                        }
                    });


                    if (e.target.value) {
                        setFormErrors({
                            ...formErrors,
                            8: false
                        });
                    }

                    break;
                case 'clientAddress-country':
                    setFormData({
                        ...formData,
                        clientAddress: {
                            ...formData.clientAddress,
                            country: e.target.value
                        }
                    });


                    if (e.target.value) {
                        setFormErrors({
                            ...formErrors,
                            9: false
                        });
                    }

                    break;
                default:
                    isOpenNewInvoice ? setFormData(initialFormData) : setFormData(currentInvoice);
            }
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value.trim()
            });

            formData.clientName &&
                setFormErrors({
                    ...formErrors,
                    4: false
                });

            formData.clientEmail &&
                setFormErrors({
                    ...formErrors,
                    5: false
                });

            e.target.name === 'createdAt' && e.target.value &&
                setFormErrors({
                    ...formErrors,
                    10: false
                });

            formData.description &&
                setFormErrors({
                    ...formErrors,
                    12: false
                });
        }

        e.target.value ?
            e.target.style.border = '1px solid #57eca2' :
            e.target.style.border = '1px solid #EC5757';
    };

    const handlePaymentTerms = (e) => {
        setSelectedOption(e.target.value);

        setFormData({
            ...formData,
            paymentTerms: Number(e.target.value)
        });

        e.target.value ?
            e.target.style.border = '1px solid #57eca2' :
            e.target.style.border = '1px solid #EC5757';

        e.target.value &&
            setFormErrors({
                ...formErrors,
                11: false
            });

    };

    const handleItems = () => {
        let items = document.getElementsByClassName('invoice-modal__items-container__item');
        let cancelOption = document.getElementById('cancel');
        let saveAllOption = document.getElementById('save-all');

        let arr = [];

        for (const item of items) {
            let obj = {
                name: '',
                quantity: '',
                price: '',
                total: ''
            };

            obj.name = item.children[0].value;
            obj.quantity = Number(item.children[1].value);
            obj.price = +item.children[2].value;
            obj.total = (Number(item.children[1].value * item.children[2].value));

            if (obj.name && obj.quantity && obj.price && obj.total) {
                item.children[3].value = (+obj.total).toFixed(2);
                arr.push(obj);

                if (arr.length) {
                    setItemsArr(arr);
                }
            }

            item.children[0].value ?
                item.children[0].style.border = '1px solid #57eca2' :
                item.children[0].style.border = '1px solid #EC5757';

            item.children[1].value ?
                item.children[1].style.border = '1px solid #57eca2' :
                item.children[1].style.border = '1px solid #EC5757';

            item.children[2].value ?
                item.children[2].style.border = '1px solid #57eca2' :
                item.children[2].style.border = '1px solid #EC5757';
        }

        const itemTotals = arr && arr.map(item => item.total);

        const total = itemTotals && itemTotals.reduce((total, current) => {
            let value = +total + +current;

            return value.toFixed(2);
        }, 0);

        if (total) {
            setFormData({
                ...formData,
                total: +total
            });
        }

        if (cancelOption) {
            cancelOption.disabled = true;
            cancelOption.classList.add('cancel-disabled');
        }

        if (saveAllOption) {
            saveAllOption.disabled = true;
            saveAllOption.classList.add('save-all-disabled');
        }
    };

    const closeNewInvoice = () => {
        let inputs = document.getElementsByClassName('invoice-modal__field__input');
        let dropdown = document.getElementById('terms');

        setIsOpenNewInvoice(false);
        setItems([]);
        setItemsArr([]);
        setIsNotValid(false);

        for (const input of inputs) {
            input.value = '';
            input.classList.remove('error');
            input.style.border = 'none';
        }

        dropdown.style.border = 'none';
    };

    const closeEditInvoice = () => {
        setIsOpenEditInvoice(false);
    };

    const getRedTrashIcon = (id) => {
        let icon = document.getElementById(id);

        icon.src = deleteIconRed;
    };

    const getOriginalTrashIcon = (id) => {
        let icon = document.getElementById(id);

        icon.src = deleteIcon;
    };

    const removeInvoiceItem = (id) => {
        let items = document.getElementsByClassName(
            'invoice-modal__items-container__item'
        );

        for (const item of items) {
            if (item.id === id) {
                item.remove();
            }
        }
    };

    const addInvoiceItem = () => {
        let newItem = `<div></div>`;

        isOpenNewInvoice ?
            setItems([...items, newItem]) :
            setFormData({
                ...formData,
                items: [
                    ...formData.items,
                    {
                        name: '',
                        quantity: '',
                        price: '',
                        total: ''
                    }
                ]
            });
    };

    const handleFormErrors = () => {
        let inputs = document.getElementsByClassName('invoice-modal__field__input');
        let dropdown = document.getElementById('terms');
        let errors = { ...initialFormErrors };

        for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].value) {
                inputs[i].classList.add('error');
                errors[i] = true;
            } else {
                inputs[i].classList.remove('error');
                errors[i] = false;
            }

            setFormErrors(errors);
        }

        if (!selectedOption) {
            dropdown.style.border = '1px solid #EC5757';
        } else {
            dropdown.style.border = '1px solid #57eca2';
        }
    };

    const validateForm = () => {
        for (const key in formData) {
            if (formData[key] === '') {
                setIsNotValid(true);
            } else {
                setIsNotValid(false);
            }
        }

        handleFormErrors();
    }

    const saveAsDraft = () => {
        setFormData({
            ...formData,
            status: 'draft'
        });

        validateForm();
    };

    const saveAsPending = () => {
        setFormData({
            ...formData,
            status: 'pending'
        });

        validateForm();
    };

    const saveItems = () => {
        let cancelOption = document.getElementById('cancel');
        let saveAllOption = document.getElementById('save-all');

        setFormData({
            ...formData,
            items: itemsArr
        });

        cancelOption.disabled = false;
        cancelOption.classList.remove('cancel-disabled');
        saveAllOption.disabled = false;
        saveAllOption.classList.remove('save-all-disabled');
    };

    const saveAll = () => {
        const invoiceId = currentInvoice.id;
        const dataObj = formData;

        dispatch(updateInvoice({ invoiceId, dataObj }));

        closeEditInvoice();
    };

    const renderedItems = isOpenNewInvoice ? items && items.map((item, i) => (
        <div key={i} id={`invoice-modal-item-${i}`} className='invoice-modal__items-container__item'>
            <input aria-label='Item Name' className='item-name invoice-modal__field__input' type='text' onChange={handleItems} />
            <input aria-label='Quantity' className='item-qty invoice-modal__field__input' type='text' onChange={handleItems} />
            <input aria-label='Price' className='item-price invoice-modal__field__input' type='text' onChange={handleItems} />
            <input aria-label='Total' className='item-total invoice-modal__field__input' type='text' readOnly />
            <button type='button' className='item-remove' aria-label='Remove item' onClick={() => removeInvoiceItem(`invoice-modal-item-${i}`)} onMouseEnter={() => getRedTrashIcon(`trash-icon-${i}`)} onMouseLeave={() => getOriginalTrashIcon(`trash-icon-${i}`)}><img id={`trash-icon-${i}`} className='trash-icon' src={deleteIcon} alt='' /></button>
            <span className='item-label item-label-name' aria-hidden='true'>Item Name</span>
            <span className='item-label item-label-qty' aria-hidden='true'>Qty.</span>
            <span className='item-label item-label-price' aria-hidden='true'>Price</span>
            <span className='item-label item-label-total' aria-hidden='true'>Total</span>
        </div>)) :
        formData && formData.items.map((item, i) => (
            <div key={i} id={`invoice-modal-item-${i}`} className='invoice-modal__items-container__item'>
                <input aria-label='Item Name' className='item-name invoice-modal__field__input' type='text' defaultValue={item.name} onChange={handleItems} />
                <input aria-label='Quantity' className='item-qty invoice-modal__field__input' type='text' defaultValue={item.quantity} onChange={handleItems} />
                <input aria-label='Price' className='item-price invoice-modal__field__input' type='text' defaultValue={item.price} onChange={handleItems} />
                <input aria-label='Total' className='item-total invoice-modal__field__input' type='text' defaultValue={item.total} readOnly />
                <span className='item-label item-label-name' aria-hidden='true'>Item Name</span>
                <span className='item-label item-label-qty' aria-hidden='true'>Qty.</span>
                <span className='item-label item-label-price' aria-hidden='true'>Price</span>
                <span className='item-label item-label-total' aria-hidden='true'>Total</span>
            </div>
        ));

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previousOverflow; };
    }, []);

    useEffect(() => {
        setItemsArr(formDataItems);
    }, [formDataItems]);

    useEffect(() => {
        isOpenNewInvoice &&
            setFormData({
                ...formData,
                items: itemsArr
            });

        //eslint-disable-next-line
    }, [itemsArr]);

    useEffect(() => {
        const date = new Date(createdAt);
        const arr = [];

        let randomLetter;

        for (let i = 0; i < 2; i++) {
            randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));

            arr.push(randomLetter);
        }

        for (let i = 0; i < 4; i++) {
            let randomNumber = Math.floor(Math.random() * 10);

            arr.push(randomNumber);
        }

        let invoiceId = `${arr[0]}${arr[1]}${arr[2]}${arr[3]}${arr[4]}${arr[5]}`;

        if (invoiceId) {
            setFormData({
                ...formData,
                id: invoiceId
            });
        }

        if (paymentTerm && createdAt) {
            const invoiceDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));
            invoiceDate.setDate(invoiceDate.getDate() + paymentTerm);

            if (invoiceDate) {
                setFormData({
                    ...formData,
                    paymentDue: invoiceDate.toISOString().slice(0, 10)
                });
            }
        }
        //eslint-disable-next-line
    }, [createdAt, paymentTerm]);

    useEffect(() => {
        if (isOpenNewInvoice && status && !isNotValid) {
            dispatch(addInvoice({ formData }));
            closeNewInvoice();
            window.location.reload();
        }
        //eslint-disable-next-line
    }, [status, isNotValid]);

    return (
        <>
            <div className="overlay"></div>
            <div className="invoice-modal" role="dialog" aria-modal="true" aria-labelledby="invoice-modal-title">
                <h1 id="invoice-modal-title">{isOpenNewInvoice ? 'New Invoice' : <div>Edit<span>#</span>{invoiceId}</div>}</h1>

                <h2>Bill From</h2>

                <div className="invoice-modal__field">
                    <label>Street Address</label>
                    <input name="senderAddress-street" className="invoice-modal__field__input" type="text" defaultValue={isOpenNewInvoice ? '' : formData?.senderAddress?.street} onChange={handleChange} />
                    <div className="invoice-modal__field__container">
                        {formErrors[0] &&
                            <div>can't be empty</div>
                        }
                    </div>
                </div>


                <div className="invoice-modal__location">
                    <div className="invoice-modal__field">
                        <label>City</label>
                        <input name="senderAddress-city" className="invoice-modal__field__input" type="text" defaultValue={isOpenNewInvoice ? '' : formData?.senderAddress?.city} onChange={handleChange} />
                        <div className="invoice-modal__field__container">
                            {formErrors[1] &&
                                <div>can't be empty</div>
                            }
                        </div>
                    </div>

                    <div className="invoice-modal__field">
                        <label>Post Code</label>
                        <input name="senderAddress-postCode" className="invoice-modal__field__input" type="text" defaultValue={isOpenNewInvoice ? '' : formData?.senderAddress?.postCode} onChange={handleChange} />
                        <div className="invoice-modal__field__container">
                            {formErrors[2] &&
                                <div>can't be empty</div>
                            }
                        </div>
                    </div>

                    <div className="invoice-modal__field">
                        <label>Country</label>
                        <input name="senderAddress-country" className="invoice-modal__field__input" type="text" defaultValue={isOpenNewInvoice ? '' : formData?.senderAddress?.country} onChange={handleChange} />
                        <div className="invoice-modal__field__container">
                            {formErrors[3] &&
                                <div>can't be empty</div>
                            }
                        </div>
                    </div>
                </div>

                <h2>Bill To</h2>

                <div className="invoice-modal__field">
                    <label>Client's Name</label>
                    <input name="clientName" className="invoice-modal__field__input" type="text" defaultValue={isOpenNewInvoice ? '' : formData?.clientName} onChange={handleChange} />
                    <div className="invoice-modal__field__container">
                        {formErrors[4] &&
                            <div>can't be empty</div>
                        }
                    </div>
                </div>

                <div className="invoice-modal__field">
                    <label>Client's Email</label>
                    <input name="clientEmail" className="invoice-modal__field__input" type="text" placeholder="e.g. email@example.com" defaultValue={isOpenNewInvoice ? '' : formData?.clientEmail} onChange={handleChange} />
                    <div className="invoice-modal__field__container">
                        {formErrors[5] &&
                            <div>can't be empty</div>
                        }
                    </div>
                </div>

                <div className="invoice-modal__field">
                    <label>Street Address</label>
                    <input name="clientAddress-street" className="invoice-modal__field__input" type="text" defaultValue={isOpenNewInvoice ? '' : formData?.clientAddress?.street} onChange={handleChange} />
                    <div className="invoice-modal__field__container">
                        {formErrors[6] &&
                            <div>can't be empty</div>
                        }
                    </div>
                </div>

                <div className="invoice-modal__location">
                    <div className="invoice-modal__field">
                        <label>City</label>
                        <input name="clientAddress-city" className="invoice-modal__field__input" type="text" defaultValue={isOpenNewInvoice ? '' : formData?.clientAddress?.city} onChange={handleChange} />
                        <div className="invoice-modal__field__container">
                            {formErrors[7] &&
                                <div>can't be empty</div>
                            }
                        </div>
                    </div>

                    <div className="invoice-modal__field">
                        <label>Post Code</label>
                        <input name="clientAddress-postCode" className="invoice-modal__field__input" type="text" defaultValue={isOpenNewInvoice ? '' : formData?.clientAddress?.postCode} onChange={handleChange} />
                        <div className="invoice-modal__field__container">
                            {formErrors[8] &&
                                <div>can't be empty</div>
                            }
                        </div>
                    </div>

                    <div className="invoice-modal__field">
                        <label>Country</label>
                        <input name="clientAddress-country" className="invoice-modal__field__input" type="text" defaultValue={isOpenNewInvoice ? '' : formData?.clientAddress?.country} onChange={handleChange} />
                        <div className="invoice-modal__field__container">
                            {formErrors[9] &&
                                <div>can't be empty</div>
                            }
                        </div>
                    </div>
                </div>

                <div className="invoice-modal__date-terms">
                    <div className="invoice-modal__field">
                        <label id="invoice-date-label">Invoice Date</label>
                        <input name="createdAt" className="invoice-modal__field__input" type="date" defaultValue={isOpenNewInvoice ? '' : formData?.createdAt} onChange={handleChange} />
                        <div className="invoice-modal__field__container">
                            {formErrors[10] &&
                                <div>can't be empty</div>
                            }
                        </div>
                    </div>

                    <div className="invoice-modal__field">
                        <label htmlFor="payment-terms">Payment Terms</label>

                        <select id="terms" name="payment-terms" className="invoice-modal__field__input" value={selectedOption} onChange={handlePaymentTerms}>
                            <option id="option1" value="" disabled>Select term</option>
                            <option value="1">Next 1 Day</option>
                            <option value="7">Next 7 Days</option>
                            <option value="14">Next 14 Days</option>
                            <option value="30">Next 30 Days</option>
                        </select>
                        <div className="invoice-modal__field__container">
                            {formErrors[11] &&
                                <div>can't be empty</div>
                            }
                        </div>
                    </div>
                </div>

                <div className="invoice-modal__field">
                    <label>Project Description</label>
                    <input name="description" type="text" className="invoice-modal__field__input" placeholder="e.g. Graphic Design Service" defaultValue={isOpenNewInvoice ? '' : formData?.description} onChange={handleChange} />
                    <div className="invoice-modal__field__container">
                        {formErrors[12] &&
                            <div>can't be empty</div>
                        }
                    </div>
                </div>

                <h2>Item List</h2>

                <div className="invoice-modal__list-items">
                    <span>Item Name</span>
                    <span>Qty.</span>
                    <span>Price</span>
                    <span>Total</span>
                </div>

                <div className="invoice-modal__items-container">
                    {renderedItems}
                </div>

                {setIsOpenNewInvoice &&
                    <button className="invoice-modal__add-item" onClick={addInvoiceItem}>
                        <img src={plusIcon} alt="add-icon" />
                        Add New Item
                    </button>
                }

                {isOpenEditInvoice &&
                    <div className="invoice-modal__add-item__container">
                        <button className="invoice-modal__add-item" onClick={addInvoiceItem}>
                            <img src={plusIcon} alt="add-icon" />
                            Add New Item
                        </button>

                        <button className="invoice-modal__save-changes" onClick={saveItems}>
                            Save Items
                        </button>
                    </div>
                }

                {isOpenNewInvoice &&
                    <div className="invoice-modal__options">
                        <div>
                            <button id="discard" onClick={closeNewInvoice}>Discard</button>
                        </div>

                        <div>
                            <button id="save-draft" onClick={saveAsDraft}>Save as Draft</button>
                            <button id="save-send" onClick={saveAsPending}>Save & Send</button>
                        </div>
                    </div>
                }

                {isOpenEditInvoice &&
                    <div className="invoice-modal__options">
                        <div>
                            <button id="cancel" className="invoice-modal__options__cancel" onClick={closeEditInvoice}>Cancel</button>
                            <button id="save-all" className="invoice-modal__options__save-all" onClick={saveAll}>Save All</button>
                        </div>
                    </div>
                }

                {isNotValid &&
                    <div className="invoice-modal__errors">
                        <p> - All fields must be added</p>
                        <p> - An item must be added</p>
                    </div>
                }
            </div>
        </>
    )
}

export default InvoiceModal;