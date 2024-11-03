// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IRefugeeIdentity {
    function getRefugee(string memory _id) external view returns (
        string memory name,
        string memory countryOfOrigin,
        uint256 dateOfBirth,
        bool isVerified,
        address registeredBy,
        address verifiedBy
    );
    
    function authorizedVerifiers(address) external view returns (bool);
    function verifyRefugee(string memory _id) external;
}

contract RefugeeVerificationInfo is Ownable {
    IRefugeeIdentity public refugeeIdentityContract;

    mapping(string => bool) private verifiedRefugees;
    string[] private allVerifiedRefugeeIds;
    mapping(address => string[]) private verifierToRefugees;

    event RefugeeIdentityContractUpdated(address newAddress);
    event MultipleRefugeesVerified(string[] ids, address verifiedBy);

    constructor(address initialOwner, address _refugeeIdentityContract) Ownable(initialOwner) {
        refugeeIdentityContract = IRefugeeIdentity(_refugeeIdentityContract);
    }

    function getRefugeeVerificationStatus(string memory _id) public view returns (
        bool isVerified,
        address verifier,
        string memory name
    ) {
        (
            string memory refugeeName,
            ,
            ,
            bool verified,
            ,
            address verifiedBy
        ) = refugeeIdentityContract.getRefugee(_id);

        return (verified, verifiedBy, refugeeName);
    }

    function isVerifier(address _address) public view returns (bool) {
        return refugeeIdentityContract.authorizedVerifiers(_address);
    }

    function updateRefugeeIdentityContract(address _newAddress) public onlyOwner {
        refugeeIdentityContract = IRefugeeIdentity(_newAddress);
        emit RefugeeIdentityContractUpdated(_newAddress);
    }

    function getAllVerifiedRefugees() public view returns (string[] memory) {
        return allVerifiedRefugeeIds;
    }

    function getTotalVerifiedRefugees() public view returns (uint256) {
        return allVerifiedRefugeeIds.length;
    }

    function hasVerifiedAnyRefugee(address verifier) public view returns (bool) {
        return verifierToRefugees[verifier].length > 0;
    }

    function getRefugeesVerifiedBy(address verifier) public view returns (string[] memory) {
        return verifierToRefugees[verifier];
    }

    function verifyMultipleRefugees(string[] memory _ids) public {
        require(isVerifier(msg.sender), "Not an authorized verifier");
        
        for (uint i = 0; i < _ids.length; i++) {
            string memory _id = _ids[i];
            (bool alreadyVerified, , ) = getRefugeeVerificationStatus(_id);
            
            if (!alreadyVerified) {
                refugeeIdentityContract.verifyRefugee(_id);
                if (!verifiedRefugees[_id]) {
                    verifiedRefugees[_id] = true;
                    allVerifiedRefugeeIds.push(_id);
                    verifierToRefugees[msg.sender].push(_id);
                }
            }
        }

        emit MultipleRefugeesVerified(_ids, msg.sender);
    }

    function syncVerificationStatus(string memory _id) public {
        (bool isVerified, address verifier, ) = getRefugeeVerificationStatus(_id);
        
        if (isVerified && !verifiedRefugees[_id]) {
            verifiedRefugees[_id] = true;
            allVerifiedRefugeeIds.push(_id);
            verifierToRefugees[verifier].push(_id);
        }
    }
}
