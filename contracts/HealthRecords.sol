// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthRecords {
    struct ImmunizationRecord {
        string id;
        string name;
        string date;
    }

    struct MedicalHistoryRecord {
        string recordID;
        string diagnosis;
        string treatment;
        string date;
        string note;
    }

    struct HealthRecord {
        string refugeeID;
        string gender;
        string bloodType;
        ImmunizationRecord[] immunizationRecords;
        MedicalHistoryRecord[] medicalHistories;
    }

    mapping(string => HealthRecord) private healthRecords;

    event HealthRecordAdded(string refugeeID);

    // Function to add a new health record
    function addHealthRecord(
        string memory _refugeeID,
        string memory _gender,
        string memory _bloodType,
        ImmunizationRecord[] memory _immunizations,
        MedicalHistoryRecord[] memory _medicalHistories
    ) public {
        healthRecords[_refugeeID] = HealthRecord({
            refugeeID: _refugeeID,
            gender: _gender,
            bloodType: _bloodType,
            immunizationRecords: _immunizations,
            medicalHistories: _medicalHistories
        });
        emit HealthRecordAdded(_refugeeID);
    }

    // Function to retrieve health record by refugee ID
    function getHealthRecord(string memory _refugeeID) public view returns (HealthRecord memory) {
        return healthRecords[_refugeeID];
    }
}