{
	var openTags = [];
}

File
	= 	Whitespace* tags:(tag:Tag Whitespace* { return tag })*
    	{
        	return tags;
        }
	;

Tag
	= 	tagInfo:TagOpen children:TagContent TagClose 
		{
			var name = tagInfo.name;
			var props = {};
			for(var prop of tagInfo.props) {
				props[prop.name] = prop.value;
			}
			return {
				name,
				props,
				children,
			};
		}
	/	tag:AutoclosedTag
		{
			var name = tagInfo.name;
			var props = {};
			for(var prop of tagInfo.props) {
				props[prop.name] = prop.value;
			}
			return {
				name,
				props,
			};
		}
	;

AutoclosedTag
	= 	"<" Whitespace? name:Name props:Props? Whitespace? "/>"
		{
			props = props || [];
			return {
				name,
				props,
			};
		}
	;

TagOpen
	= 	"<" Whitespace? name:Name props:Props? Whitespace? ">"
		{
			props = props || [];
			openTags.push(name);
			return {
				name,
				props,
			};
		}
	;

InnerTagClose
	= 	"</" Whitespace? name:Name Whitespace? ">"
    	{
        	return { name };
    	}
	;

TagClose
	= 	"</" Whitespace? name:Name Whitespace? ">"
    	{
    		var expectedTag = openTags[openTags.length - 1];
	    	if(expectedTag !== name) {
    	    	error("Expected " + expectedTag + " but found " + name);
        	}
    		openTags.pop();
        	return { name };
    	}
    ;

TagContent
	=	TagContentPart*
    	{
        	return text();
        }
    ;

TagContentPart
	= 	!InnerTagClose .
    / 	tagInfo:InnerTagClose
    	!{
    		var expectedTag = openTags[openTags.length - 1];
        	return expectedTag === tagInfo.name;
        }
    ;

Props
	= 	props:(Whitespace prop:Prop { return prop })+
		{
    		return props;
    	}
	;
    
Prop
	= 	name:Name "=" value:PropValue
    	{
        	return { name, value };
        }
    / 	name:Name
    	{
        	return { name };
        }
    ;

PropValue
	= 	'"' chars:DoubleQuotedStringChar* '"'
		{
			return chars.join("");
		}
	/ 	"'" chars:SingleQuotedStringChar* "'"
		{
			return chars.join("");
		}
    /	chars:[A-Za-z\_-]+
		{
			return chars.join("");
		}
    ;

DoubleQuotedStringChar
	=	!'"' char:. { return char; }
    /	"\\" char:. { return char; }
    ;

SingleQuotedStringChar
	=	!"'" char:. { return char; }
    /	"\\" char:. { return char; }
    ;

Name
	= 	[A-Za-z\-_]+ { return text(); }
	;

Whitespace
	= 	(" " / "\n" / "\r")+
	;