export default function tableDateFormatter(cell, row) {
    const date = new Date(cell)
    const renderDate = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`
    return(
        <p>{renderDate}</p>
    )
}