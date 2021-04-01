public with sharing class AccountRecordsListController 
{
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountsList() 
    {
        
        return [ 
                SELECT Name, OwnerId, Phone, Website, AnnualRevenue, Industry
                FROM Account 
                WHERE Industry = 'Financial Services'
                WITH SECURITY_ENFORCED
                ORDER BY Name
        ];
        
    }
  
}