#!/bin/bash

# Check if network argument is provided
if [ -z "$1" ]; then
    echo "Usage: ./deploy-and-sync.sh <network>"
    echo "Example: ./deploy-and-sync.sh sepolia"
    echo "Example: ./deploy-and-sync.sh localhost"
    exit 1
fi

NETWORK=$1

echo "Deploying TokenFactory to $NETWORK..."

# Run deployment and capture output
# We use tee to show output to user while capturing it
OUTPUT=$(npx hardhat run scripts/deploy-factory.js --network $NETWORK 2>&1 | tee /dev/tty)

# Check if deployment was successful
if [[ $OUTPUT == *"Error"* ]] || [[ $OUTPUT == *"HardhatError"* ]]; then
    echo "❌ Deployment failed. Please check the logs above."
    exit 1
fi

# Extract address using regex (looking for "合约地址: 0x...")
# Note: Adjust regex based on exact output format of deploy-factory.js
ADDRESS=$(echo "$OUTPUT" | grep -o "合约地址: 0x[a-fA-F0-9]\{40\}" | cut -d' ' -f2)

if [ -z "$ADDRESS" ]; then
    echo "❌ Could not extract contract address from output."
    exit 1
fi

echo "✅ Contract deployed at: $ADDRESS"

# Update frontend constant
FRONTEND_FILE="../frontend/src/constants/contracts.ts"

if [ -f "$FRONTEND_FILE" ]; then
    echo "Updating $FRONTEND_FILE..."
    
    # Use sed to replace the address
    # We look for "export const TOKEN_FACTORY_ADDRESS: Address ="
    # Mac params for sed -i are slightly different (requires '')
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/export const TOKEN_FACTORY_ADDRESS: Address = '0x[a-fA-F0-9]\{40\}'/export const TOKEN_FACTORY_ADDRESS: Address = '$ADDRESS'/g" "$FRONTEND_FILE"
        # Also handle if it's currently the zero address (initial state)
        sed -i '' "s/export const TOKEN_FACTORY_ADDRESS: Address = '0x0000000000000000000000000000000000000000'/export const TOKEN_FACTORY_ADDRESS: Address = '$ADDRESS'/g" "$FRONTEND_FILE"
    else
        sed -i "s/export const TOKEN_FACTORY_ADDRESS: Address = '0x[a-fA-F0-9]\{40\}'/export const TOKEN_FACTORY_ADDRESS: Address = '$ADDRESS'/g" "$FRONTEND_FILE"
        sed -i "s/export const TOKEN_FACTORY_ADDRESS: Address = '0x0000000000000000000000000000000000000000'/export const TOKEN_FACTORY_ADDRESS: Address = '$ADDRESS'/g" "$FRONTEND_FILE"
    fi
    
    echo "✅ Frontend updated successfully!"
else
    echo "❌ Frontend file not found at $FRONTEND_FILE"
fi

echo "🎉 Done! You can now use the updated TokenFactory on the frontend."
