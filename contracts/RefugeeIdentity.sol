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
    }

    mapping(string => Refugee) private refugees;

    event RefugeeRegistered(string id, string name);

    function registerRefugee(
        string memory _id,
        string memory _name,
        string memory _countryOfOrigin,
        uint256 _dateOfBirth
    ) public onlyOwner {
        require(!refugees[_id].isRegistered, "Refugee already registered");

        refugees[_id] = Refugee({
            id: _id,
            name: _name,
            countryOfOrigin: _countryOfOrigin,
            dateOfBirth: _dateOfBirth,
            isRegistered: true
        });

        emit RefugeeRegistered(_id, _name);
    }

    function getRefugee(string memory _id) public view returns (
        string memory name,
        string memory countryOfOrigin,
        uint256 dateOfBirth
    ) {
        require(refugees[_id].isRegistered, "Refugee not found");
        Refugee memory refugee = refugees[_id];
        return (refugee.name, refugee.countryOfOrigin, refugee.dateOfBirth);
    }
}

