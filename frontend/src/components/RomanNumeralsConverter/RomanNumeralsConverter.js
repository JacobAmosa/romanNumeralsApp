import React, {useEffect, useState} from "react";
import { Provider, defaultTheme, darkTheme, TextField, Button, Form, Heading, Flex, Text } from "@adobe/react-spectrum";

const RomanNumeralsConverter = () => {
    const [formData, setFormData] = useState({ number: "" });
    const [romanNumeral, setRomanNumeral] = useState("");
    const [error, setError] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setIsDarkMode(savedTheme === "dark");
        }
    }, []);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/romannumeral?query=${formData.number}`);
            const data = await response.json();
            if (response.ok) {
                setRomanNumeral(data.output);
                setError("");
            } else {
                setError(data);
                setRomanNumeral("");
            }
        } catch (err) {
            setError("There was an error processing the request.");
            setRomanNumeral("");
        }
    };

    return (
        <Provider theme={isDarkMode ? darkTheme : defaultTheme}>
            <Flex direction="column" alignItems="center" justifyContent="center" height="100vh">
                <Form aria-labelledby="form-title" onSubmit={handleSubmit} width="size-3600">
                    <Heading level={2} id="form-title">
                        Roman Numerals Converter
                    </Heading>

                    <TextField
                        label="Number"
                        value={formData.number}
                        onChange={(value) => handleChange("number", value)}
                        isRequired
                        type="number"
                    />

                    <Button variant="primary" type="submit">Convert</Button>
                </Form>

                {/* Display Roman numeral result if available */}
                {romanNumeral && (
                    <Text marginTop="size-200" UNSAFE_style={{ fontSize: "20px" }}>
                        Roman Numeral: {romanNumeral}
                    </Text>
                )}

                {/* Display error message if available */}
                {error && (
                    <Text marginTop="size-200" UNSAFE_style={{ color: "red", fontSize: "16px" }}>
                        Error: {error}
                    </Text>
                )}
            </Flex>
        </Provider>
    );
};

export default RomanNumeralsConverter;