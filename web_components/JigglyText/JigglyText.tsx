import './JigglyText.css';

interface JigglyTextProps {
    text: string;
}

function JigglyText({ text }: JigglyTextProps) {
    const charArray = text.split('');
    const jigglyText = charArray.map((char, index) => {
        return (
            <span className="jiggly-char" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                {char === " " ? "\u00A0" : char}
            </span>
        );
    });

    return (
        <div className="jiggly-text">
            {jigglyText}
        </div>
    )
}

export default JigglyText;