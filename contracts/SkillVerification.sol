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
    uint256 public verificationFee = 0.001 ether; // 0.001 Sepolia ETH

    event SkillVerified(address indexed user, string skill, address verifier);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function verifySkill(address user, string memory skillName) public payable {
        require(msg.value >= verificationFee, "Insufficient verification fee");
        require(user != msg.sender, "Cannot verify own skills");
        require(!userSkills[user][skillName].isVerified, "Skill already verified");
        emit SkillVerified(user, skillName, msg.sender);
        userSkills[user][skillName] = Skill(skillName, msg.sender, block.timestamp, true);
        emit SkillVerified(user, skillName, msg.sender);
    }

    function getVerifiedSkills(address user) public view returns (string[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < 100; i++) { // Arbitrary limit to prevent gas issues
            if (bytes(userSkills[user][string(abi.encodePacked(i))].name).length > 0) {
                count++;
            } else {
                break;
            }
        }

        string[] memory skills = new string[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < count; i++) {
            string memory skillName = userSkills[user][string(abi.encodePacked(i))].name;
            if (bytes(skillName).length > 0) {
                skills[index] = skillName;
                index++;
            }
        }

        return skills;
    }

    function setVerificationFee(uint256 newFee) public onlyOwner {
        verificationFee = newFee;
    }

    function withdrawFees() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
