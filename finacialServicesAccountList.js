import { LightningElement, wire, api } from 'lwc';
import getAccountsList from '@salesforce/apex/AccountRecordsListController.getAccountsList';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone'
import WEBSITE_FIELD from '@salesforce/schema/Account.Website'
import REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';


const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name', type: 'text' },
    { label: 'Phone', fieldName: 'Phone', type: 'Phone', editable: true},
    { label: 'Website', fieldName: 'Website', type: 'Url', editable: true},
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency', editable: true},
    { label: 'Industry', fieldName: 'Industry', type: 'text' }
];
export default class FinacialServicesAccountList extends LightningElement {
    columns = COLUMNS;
    
    draftValues = [];
    @wire(getAccountsList)
    accountlist;
    

    handleSave(event) {

        const fields = {}; 
        fields[PHONE_FIELD.fieldApiName] = event.detail.draftValues[0].Phone;
        fields[WEBSITE_FIELD.fieldApiName] = event.detail.draftValues[0].Website;
        fields[REVENUE_FIELD.fieldApiName] = event.detail.draftValues[0].AnnualRevenue;

        const recordInput = {fields};

        updateRecord(recordInput).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account updated',
                    variant: 'success'
                })
            );
           
            return refreshApex(this.account).then(() => {

                this.draftValues = [];

            });
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

  }