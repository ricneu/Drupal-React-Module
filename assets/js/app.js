
class EstablishmentRow extends React.Component {
    render() {
        const establishment = this.props.establishment;
        const taxonomy = this.props.taxonomy;
        const title = establishment.title[0].value;
        const smallArea = establishment.field_business_clue_small_area[0].value;
        const industry = taxonomy[establishment.field_business_industry[0].target_id];
        const seats = establishment.field_business_seats[0].count;
        const seattype = establishment.field_business_seats[0].seattype;
        const streetAddress = establishment.field_business_street_address[0].value;

        return (
            <tr>
                <td>{title}</td>
                <td>{smallArea}</td>
                <td>{industry}</td>
                <td>{seattype} ({seats})</td>
                <td>{streetAddress}</td>
            </tr>
        );
    }
}

class EstablishmentTable extends React.Component {
    render() {
        const filterText = this.props.filterText;
        const rows = [];

        this.props.establishment.forEach((establishment) => {
            /*if(this.props.filterText == 0){
                return;
            }*/
            if (( this.props.taxonomy[establishment.field_business_industry[0].target_id].indexOf(filterText) >= 0) ||(establishment.title[0].value.indexOf(filterText) >= 0) || (establishment.field_business_street_address[0].value.indexOf(filterText) >= 0)) {
                rows.push(
                    <EstablishmentRow
                        establishment={establishment}
                        taxonomy={this.props.taxonomy}
                        key={establishment.title[0].value}
                    />
                );
            }
            return;


        });

        return (
            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>CLUE Small Area</th>
                    <th>Business Industry</th>
                    <th>Seats</th>
                    <th>Street Address</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    }

    handleFilterTextChange(e) {
        this.props.onFilterTextChange(e.target.value);
    }


    render() {
        return (
            <form className="contact-form">
                <input
                    type="text"
                    placeholder="Search for Title or Street"
                    value={this.props.filterText}
                    onChange={this.handleFilterTextChange}
                />
            </form>
        );
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            data: [],
            taxonomy: []
        };

        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    }

    handleFilterTextChange(filterText) {
        this.setState({
            filterText: filterText
        });
    }
    // calling the componentDidMount() method after a component is rendered for the first time
    componentDidMount() {
        var th = this;
        this.serverRequestTaxonomy = axios.get(this.props.taxonomy)
            .then(function(event) {
                th.setState({
                    taxonomy: event.data
                });
            })
        this.serverRequest = axios.get(this.props.source)
            .then(function(event) {
                th.setState({
                    data: event.data
                });
            })
    }

        // calling the componentWillUnMount() method immediately before a component is unmounted from the DOM componentWillUnmount() {
        this.serverRequestTaxonomy.abort();
        this.serverRequest.abort();
    }

    render() {
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    onFilterTextChange={this.handleFilterTextChange}
                />
                <EstablishmentTable
                    establishment={this.state.data}
                    taxonomy={this.state.taxonomy}
                    filterText={this.state.filterText}
                />
            </div>

        );
    }
}



// rendering into the DOM. Include here your API Resource
ReactDOM.render(
    <App source="###PATH_TO_JSON_API###" taxonomy="/taxonomy-json"  />,
    document.getElementById('container')
);