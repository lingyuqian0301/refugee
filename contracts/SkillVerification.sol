// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SkillVerification is Ownable {
    struct Skill {
        string name;
        address verifier;
        uint256 timestamp;
        bool isVerified;
    }

    mapping(address => mapping(string => Skill)) public userSkills;
    mapping(address => string[]) private userSkillsList;

    uint256 public verificationFee = 0.001 ether;

    event SkillVerified(address indexed user, string skill, address verifier);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function verifySkill(address user, string memory skillName) public payable {
        require(msg.value >= verificationFee, "Insufficient verification fee");
        require(user != msg.sender, "Cannot verify own skills");
        require(!userSkills[user][skillName].isVerified, "Skill already verified");

        string[] storage skillsList = userSkillsList[user];
        
        bool skillExists = false;
        for (uint i = 0; i < skillsList.length; i++) {
            if (keccak256(bytes(skillsList[i])) == keccak256(bytes(skillName))) {
                skillExists = true;
                break;
            }
        }
        if (!skillExists) {
            userSkillsList[user].push(skillName);
        }

        userSkills[user][skillName] = Skill(skillName, msg.sender, block.timestamp, true);
        emit SkillVerified(user, skillName, msg.sender);
    }

    function getVerifiedSkills(address user) public view returns (string[] memory) {
        return userSkillsList[user];
    }

    function getUserSkillCount(address user) public view returns (uint256) {
        return userSkillsList[user].length;
    }

    function setVerificationFee(uint256 newFee) public onlyOwner {
        verificationFee = newFee;
    }

    function withdrawFees() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
