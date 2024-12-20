import sys

def string_to_hex(input_string):
    """
    Converts a string to its hexadecimal UTF-8 representation.
    """
    try:
        # Convert the string to UTF-8 bytes, then to a hex string
        hex_representation = input_string.encode("utf-8").hex()
        return f"0x{hex_representation}"
    except Exception as e:
        print(f"Error converting string to hex: {e}")
        sys.exit(1)

def main():
    # Check if a string is provided as a command-line argument
    if len(sys.argv) != 2:
        print("Usage: python string_to_hex.py <string>")
        sys.exit(1)

    # Get the string from command-line arguments
    input_string = sys.argv[1]
    # Convert the string to hex
    hex_result = string_to_hex(input_string)
    # Print the result
    print(hex_result)

if __name__ == "__main__":
    main()
