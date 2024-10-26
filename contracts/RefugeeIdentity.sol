// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RefugeeIdentity is Ownable {
    struct Refugee {
        string id;
        string name;
        string countryOfOrigin;
        uint256 dateOfBirth;
        bool isRegistered;
        bool isVerified;
        address registeredBy;
        address verifiedBy;
    }

    mapping(string => Refugee) private refugees;
    mapping(address => bool) public authorizedVerifiers;

    event RefugeeRegistered(string id, string name, address registeredBy);
    event RefugeeVerified(string id, string name, address verifiedBy);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function addAuthorizedVerifier(address verifier) public onlyOwner {
        authorizedVerifiers[verifier] = true;
    }

    function removeAuthorizedVerifier(address verifier) public onlyOwner {
        authorizedVerifiers[verifier] = false;
    }

    function registerRefugee(
        string memory _id,
        string memory _name,
        string memory _countryOfOrigin,
        uint256 _dateOfBirth
    ) public {
        require(!refugees[_id].isRegistered, "Refugee already registered");
        require(bytes(_id).length > 0, "ID cannot be empty");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_countryOfOrigin).length > 0, "Country of origin cannot be empty");
        require(_dateOfBirth > 0 && _dateOfBirth < block.timestamp, "Invalid date of birth");

        refugees[_id] = Refugee({
            id: _id,
            name: _name,
            countryOfOrigin: _countryOfOrigin,
            dateOfBirth: _dateOfBirth,
            isRegistered: true,
            isVerified: false,
            registeredBy: msg.sender,
            verifiedBy: address(0)
        });

        emit RefugeeRegistered(_id, _name, msg.sender);
    }

    function verifyRefugee(string memory _id) public {
        require(authorizedVerifiers[msg.sender], "Not an authorized verifier");
        require(refugees[_id].isRegistered, "Refugee not registered");
        require(!refugees[_id].isVerified, "Refugee already verified");

        refugees[_id].isVerified = true;
        refugees[_id].verifiedBy = msg.sender;

        emit RefugeeVerified(_id, refugees[_id].name, msg.sender);
    }

    function getRefugee(string memory _id) public view returns (
        string memory name,
        string memory countryOfOrigin,
        uint256 dateOfBirth,
        bool isVerified,
        address registeredBy,
        address verifiedBy
    ) {
        require(refugees[_id].isRegistered, "Refugee not found");
        Refugee memory refugee = refugees[_id];
        return (refugee.name, refugee.countryOfOrigin, refugee.dateOfBirth, refugee.isVerified, refugee.registeredBy, refugee.verifiedBy);
    }
}
