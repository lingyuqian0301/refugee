# Refugee Management System Documentation

## Overview
A comprehensive blockchain-based platform for managing refugee identities, health records, and aid distribution using Next.js and Ethereum smart contracts.

## System Architecture

### Frontend
- Built with Next.js 14
- Chakra UI for component styling
- Ethers.js for blockchain interactions
- Responsive design

### Backend
- Ethereum smart contracts
- Supabase database
- OpenAI integration
- API routes for data handling

## Core Features

### 1. Identity Management
#### Registration System
- Digital identity creation with blockchain verification
- Unique ID generation
- Personal information storage
- Wallet integration for security

Reference implementation:

```27:147:src/components/RefugeeRegistration.tsx
const RefugeeRegistration: React.FC = () => {
  const [refugeeData, setRefugeeData] = useState<RefugeeData>({
    id: '',
    name: '',
    countryOfOrigin: '',
    dateOfBirth: '',
    isVerified: false,
    verifiedBy: '',
  });
  const [connectedAddress, setConnectedAddress] = useState('');
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRefugeeData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setConnectedAddress(address);
      toast({
        title: "Wallet Connected",
        description: `Connected with address: ${address}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleRegistration = async () => {
    if (!connectedAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // Generate unique ID locally
      const uniqueId = getUniqueId({
        name: refugeeData.name,
        countryOfOrigin: refugeeData.countryOfOrigin,
        dateOfBirth: refugeeData.dateOfBirth,
      });

      // Update refugeeData with the new ID
      setRefugeeData(prevData => ({ ...prevData, id: uniqueId }));

      const contract = await getEthereumContract('refugeeIdentity');
      if (!contract) {
        throw new Error("Failed to get Ethereum contract");
      }
      console.log("Contract instance:", contract);

      if (!contract.registerRefugee) {
        throw new Error("registerRefugee function not found on contract");
      }
      
      const tx = await contract.registerRefugee(
        uniqueId,
        refugeeData.name,
        refugeeData.countryOfOrigin,
        Math.floor(new Date(refugeeData.dateOfBirth).getTime() / 1000)
      );
      console.log("Transaction:", tx);
      
      if (!tx || !tx.wait) {
        throw new Error("Invalid transaction object");
      }
      await tx.wait();
      console.log("Transaction mined");

      toast({
        title: "Registration Submitted",
        description: `Refugee ${refugeeData.name} has been registered with ID: ${uniqueId}. Awaiting verification.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Clear the form after successful registration
      setRefugeeData({
        id: '',
        name: '',
        countryOfOrigin: '',
        dateOfBirth: '',
        isVerified: false,
        verifiedBy: ''
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
```


#### Verification System
- Authorized verifier management
- Multi-step verification process
- Real-time status updates
- Event logging

Reference implementation:

```34:146:src/components/RefugeeVerification.tsx
const RefugeeVerification: React.FC = () => {
  const [refugeeId, setRefugeeId] = useState('');
  const [connectedAddress, setConnectedAddress] = useState('');
  const [verifiedIds, setVerifiedIds] = useState<RefugeeEvent[]>([]);
  const [refugeeInfo, setRefugeeInfo] = useState<Refugee | null>(null);
  const [registeredRefugees, setRegisteredRefugees] = useState<RegisteredRefugee[]>([]);
  const [allRefugees, setAllRefugees] = useState<(Refugee & { id: string })[]>([]);
  const toast = useToast();

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setConnectedAddress(address);
      toast({
        title: "Wallet Connected",
        description: `Connected with address: ${address}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const fetchAllRefugees = async () => {
    try {
      const contract = await getEthereumContract('refugeeIdentity');
      const filter = contract.filters.RefugeeRegistered();
      const events = await contract.queryFilter(filter);
      const refugees = await Promise.all(events.map(async (event) => {
        const id = event.args?.id;
        const info = await contract.getRefugee(id);
        return {
          id,
          name: info.name,
          countryOfOrigin: info.countryOfOrigin,
          dateOfBirth: Number(info.dateOfBirth),
          isVerified: info.isVerified,
          registeredBy: info.registeredBy,
          verifiedBy: info.verifiedBy
        };
      }));
      setAllRefugees(refugees);
      console.log("Fetched all refugees:", refugees);
    } catch (error) {
      console.error("Error fetching all refugees:", error);
      toast({
        title: "Fetch Failed",
        description: "Failed to fetch refugee information. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (connectedAddress) {
      fetchAllRefugees();
    }
  }, [connectedAddress]);
  const handleVerification = async (id: string) => {
    if (!connectedAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const contract = await getEthereumContract('refugeeIdentity');
      const tx = await contract.verifyRefugee(id);
      await tx.wait();

      toast({
        title: "Verification Successful",
        description: `Refugee with ID ${id} has been verified.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      fetchAllRefugees();
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "An error occurred during verification.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
```


### 2. Health Record Management
- Personal health information tracking
- Medical history documentation
- Immunization records
- AI-driven health recommendations

Reference implementation:

```1:19:src/app/health/data_dictionary.md
## Refugees Personal Heath Detail
- Refugees ID: MM-2024-01-0001
- Refugees Gender: M
- Refugees Blood Type: O
- Medical History: (A list of record)
- Immunization Record: (A list of record)

## Refugees Medical History 
- Record ID: MH001
- Diagnosis: Malaria
- Treatment: Antimalarial medication
- Date: 2023-05-15
- Note: Follow-up required in 2 weeks.

## Refugees Immunization Record
- Record ID: IR001
- Vaccine Name: COVID-19 (Pfizer)
- Date: 2024-01-10

```


### 3. Aid Distribution
- Multiple aid categories
- Digital wallet integration
- Sponsor management
- Transparent fund tracking

Reference implementation:

```9:46:src/app/aid/page.tsx
const aidFunds = [
  { 
    id: 1, 
    name: "Emergency Relief Fund", 
    description: "Provides immediate assistance for food, water, and basic necessities.",
    icon: FaHandHoldingHeart,
    color: "red.500"
  },
  { 
    id: 2, 
    name: "Education Support", 
    description: "Helps refugee children access education and school supplies.",
    icon: FaSchool,
    color: "blue.500"
  },
  { 
    id: 3, 
    name: "Food Security Program", 
    description: "Ensures regular meals and nutritional support for families.",
    icon: FaUtensils,
    color: "green.500"
  },
  { 
    id: 4, 
    name: "Shelter Assistance", 
    description: "Provides temporary housing and shelter improvement.",
    icon: FaHome,
    color: "orange.500"
  },
];

const sponsors = [
  { name: "UNHCR", logo: "/images/sponsors/unhcr-logo.png" },
  { name: "Red Cross", logo: "/images/sponsors/red-cross-logo.jpeg" },
  { name: "UNICEF", logo: "/images/sponsors/unicef-logo.jpg" },
  { name: "World Food Programme", logo: "/images/sponsors/wfp-logo.jpg" },
  { name: "Malaysian Government", logo: "/images/sponsors/malaysia-gov-logo.png" },
];
```


## Smart Contracts

### RefugeeIdentity Contract
- Core identity management
- Verification status tracking
- Access control
- Event emission

Reference implementation:

```6:67:contracts/RefugeeIdentity.sol
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

```


### RefugeeVerificationInfo Contract
- Verification data management
- Status tracking
- Verifier authorization
- Multi-refugee verification

Reference implementation:

```20:68:contracts/RefugeeVerificationInfo.sol
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
```


## Getting Started

### Prerequisites
- Node.js (latest LTS version)
- MetaMask or compatible Web3 wallet
- Ethereum development environment
- Package manager (npm, yarn, or pnpm)

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
NEXT_PUBLIC_ETHEREUM_NETWORK=
NEXT_PUBLIC_CONTRACT_ADDRESS=
SUPABASE_URL=
SUPABASE_KEY=
OPENAI_API_KEY=
```

4. Start the development server:
```bash
npm run dev
```

### Smart Contract Deployment
1. Configure Hardhat network settings
2. Deploy contracts:
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## Project Structure
```
refugee-management/
├── app/                    # Next.js pages and components
├── contracts/             # Ethereum smart contracts
├── scripts/              # Deployment and interaction scripts
├── src/
│   ├── components/       # React components
│   ├── utils/           # Utility functions
│   └── pages/           # Page components
└── public/              # Static assets
```

## Security Considerations
- Wallet-based authentication
- Smart contract access control
- Data encryption
- Secure API endpoints

## Contributing
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License
MIT License

## Dependencies
Key packages and versions:

```11:35:package.json
  "dependencies": {
    "@chakra-ui/react": "^2.10.3",
    "@emotion/react": "^11.13.3",
    "@emotion/styled": "^11.13.0",
    "@fortawesome/fontawesome-svg-core": "^6.6.0",
    "@fortawesome/free-brands-svg-icons": "^6.6.0",
    "@fortawesome/free-regular-svg-icons": "^6.6.0",
    "@fortawesome/free-solid-svg-icons": "^6.6.0",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@supabase/ssr": "^0.5.1",
    "@supabase/supabase-js": "^2.45.6",
    "apexcharts": "^3.54.1",
    "bcrypt": "^5.1.1",
    "framer-motion": "^11.11.9",
    "jsvectormap": "^1.6.0",
    "next": "^14.2.16",
    "openai": "^4.68.4",
    "pg": "^8.13.1",
    "react": "^18.3.1",
    "react-apexcharts": "^1.4.1",
    "react-dom": "^18.3.1",
    "react-icons": "^5.3.0",
    "rsuite": "^5.73.0",
    "supabase": "^1.207.9"
  },
```


## Deployment
The application can be deployed on Vercel with the following configuration:
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy with production settings

For detailed deployment instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Support
For support and questions:
- GitHub Issues
- Documentation Wiki
- Community Forums

## Acknowledgments
- OpenZeppelin for smart contract libraries
- Chakra UI for component framework
- Ethereum community for blockchain infrastructure