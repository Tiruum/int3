interface Props {
    children?: React.ReactNode;
}

const Modal: React.FC<Props> = ({ children }) => {
    return (
        <>
            {children}
        </>
    )
}
export default Modal